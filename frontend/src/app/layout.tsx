import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./ui/Providers/Providers";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "./ui/Providers/ErrorBoundary";
import IOSInstallPrompt from "./ui/IOSInstallPrompt";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karaadi",
  description: "iska gad ama soo gado alaabo",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpg",
    apple: [
      { url: "/logo.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Karaadi",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=document.cookie.match(/dashboard-theme=([^;]+)/);if(m&&m[1]==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col text-[#1A1A1A]"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </ErrorBoundary>
        <IOSInstallPrompt />
      </body>
    </html>
  );
}
