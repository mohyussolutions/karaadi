import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./ui/Providers/Providers";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "./ui/Providers/ErrorBoundary";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karaadi",
  description: "iska gad ama soo gado alaabo",
  icons: { icon: "/logo.jpg" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body
        className="antialiased min-h-screen flex flex-col text-[#1A1A1A]"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
