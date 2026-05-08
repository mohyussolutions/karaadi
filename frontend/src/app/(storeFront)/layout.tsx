import Navbar from "./components/navbar/main/navbar";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import AdFetcher from "./components/Advertisement/AdFetcher";
import Container from "./components/Cards/containerCards/ContainerCard";
import LanguageSync from "@/i18n/LanguageContext";
import { cookies } from "next/headers";

export default async function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialIsAuthenticated = cookieStore.has("idToken");

  return (
    <>
      <LanguageSync />
      <Navbar initialIsAuthenticated={initialIsAuthenticated} />
      <div className="h-14" />
      <main className="flex-grow">
<AdFetcher>
          <Container>
            {children}
          </Container>
        </AdFetcher>
      </main>
      <SiteFooter />
    </>
  );
}
