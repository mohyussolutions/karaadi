import Navbar from "./components/navbar/main/navbar";
import Container from "./components/Cards/ContainerCard";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import TrackVisitor from "./components/visitorsTrackUsers/TrackUniqueVisitorOnce";
import BackgroundAdWrapper from "./components/Advertisement/BackgroundAdWrapper";
import SideAds from "./components/Advertisement/SideAds";
import Providers from "../common/Providers";

export default function StoreFrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <Navbar />
      <BackgroundAdWrapper>
        <div className="min-h-screen relative">
          <TrackVisitor />
          <Container>{children}</Container>
          <SideAds />
        </div>
      </BackgroundAdWrapper>
      <SiteFooter />
    </Providers>
  );
}
