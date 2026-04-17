import Navbar from "./components/navbar/main/navbar";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import AdFetcher from "./components/Advertisement/AdFetcher";
import Container from "./components/Cards/containerCards/ContainerCard";
import TrackVisitor from "../ui/invoices/TrackUniqueVisitorOnce";
import { Suspense } from "react";

export default function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
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
