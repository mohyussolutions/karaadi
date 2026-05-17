import Navbar from "./components/navbar/main/navbar";
import PushPermissionBanner from "./components/notifications/PushPermissionBanner";
import MessageNotificationToast from "./components/notifications/MessageNotificationToast";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import AdFetcher from "./components/Advertisement/AdFetcher";
import Container from "./components/Cards/containerCards/ContainerCard";
import TrackVisitor from "../ui/invoices/TrackUniqueVisitorOnce";
import LanguageSync from "@/i18n/LanguageContext";
import StoreFrontThemeReset from "./components/StoreFrontThemeReset";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialIsAuthenticated =
    cookieStore.has("idToken") ||
    cookieStore.has("accessToken") ||
    cookieStore.has("token");

  return (
    <>
      <StoreFrontThemeReset />
      <LanguageSync />
      <Navbar initialIsAuthenticated={initialIsAuthenticated} />
      <main className="flex-grow bg-[#FEFDFD]" style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top))" }}>
        <Suspense fallback={null}>
          <TrackVisitor />
        </Suspense>
        <AdFetcher>
          <Container>
            {children}
          </Container>
        </AdFetcher>
      </main>
      <PushPermissionBanner />
      <MessageNotificationToast />
      <SiteFooter />
    </>
  );
}
