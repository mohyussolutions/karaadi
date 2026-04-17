const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverActions: {
    bodySizeLimit: "20mb",
  },
  experimental: {},
  optimizePackageImports: [
    "react-icons",
    "lucide-react",
    "framer-motion",
    "recharts",
    "react-i18next",
    "i18next",
    "@vis.gl/react-google-maps",
    "date-fns",
  ],
  images: {
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
    ],
  },
};

export default nextConfig;
