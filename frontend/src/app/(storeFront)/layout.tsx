import Navbar from "./components/navbar/main/navbar";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import AdFetcher from "./components/Advertisement/AdFetcher";
import Container from "./components/Cards/containerCards/ContainerCard";
import TrackVisitor from "../ui/invoices/TrackUniqueVisitorOnce";
import { Suspense } from "react";
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
      <Navbar initialIsAuthenticated={initialIsAuthenticated} />
      <div className="h-14" />
      <main className="flex-grow">
        <TrackVisitor />
        <AdFetcher>
          <Container>
            <Suspense>{children}</Suspense>
          </Container>
        </AdFetcher>
      </main>
      <SiteFooter />
    </>
  );
}
