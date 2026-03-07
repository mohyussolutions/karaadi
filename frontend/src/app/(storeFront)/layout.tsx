import Navbar from "./components/navbar/main/navbar";
import Container from "./components/Cards/ContainerCard";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import TrackVisitor from "./components/visitorsTrackUsers/TrackUniqueVisitorOnce";
import BackgroundAdWrapper from "./components/Advertisement/BackgroundAdWrapper";
import SideAds from "./components/Advertisement/SideAds";
import { getAdvertisements } from "@/actions/categories/advertisementService";

export default async function StoreFrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [bgAds, sideAds] = await Promise.all([
    getAdvertisements("background", 1),
    getAdvertisements("sidebar", 1),
  ]);

  const backgroundAd = bgAds?.[0] || null;
  const sidebarAd = sideAds?.[0] || null;

  return (
    <>
      <Navbar />
      <BackgroundAdWrapper ad={backgroundAd}>
        <div className="min-h-screen relative">
          <TrackVisitor />
          <Container>{children}</Container>
          <SideAds ad={sidebarAd} />
        </div>
      </BackgroundAdWrapper>
      <SiteFooter />
    </>
  );
}
