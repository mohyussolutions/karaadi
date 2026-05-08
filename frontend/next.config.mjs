/** @type {import('next').NextConfig} */
const PROD_API = "https://s55gb5sdnl.execute-api.eu-west-1.amazonaws.com/prod";

const resolvedApiUrl =
  process.env.NODE_ENV === "production"
    ? PROD_API
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: resolvedApiUrl,
    NEXT_PUBLIC_SOCKET_URL: resolvedApiUrl,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  httpAgentOptions: { keepAlive: true },

  experimental: {
    serverActions: { bodySizeLimit: "20mb" },
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "framer-motion",
      "recharts",
      "react-i18next",
      "i18next",
      "date-fns",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/(.*)\\.map",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "**.istockphoto.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.imgix.net" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.firebaseapp.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "**.imgur.com" },
      { protocol: "http", hostname: "localhost", port: "8080" },
      { protocol: "https", hostname: "api.karaadi.com" },
      { protocol: "https", hostname: "*.execute-api.eu-west-1.amazonaws.com" },
    ],
  },
};

export default nextConfig;
