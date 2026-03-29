import Navbar from "./components/navbar/main/navbar";
import Container from "./components/Cards/ContainerCard";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import TrackVisitor from "./components/visitorsTrackUsers/TrackUniqueVisitorOnce";
import AdFetcher from "./components/Advertisement/AdFetcher";

export default function StoreFrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <AdFetcher>
        <TrackVisitor />
        <Container>{children}</Container>
      </AdFetcher>
      <SiteFooter />
    </>
  );
}
