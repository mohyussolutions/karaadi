import { getAdvertisements } from "@/actions/categories/advertisementService";
import BackgroundAdWrapper from "./BackgroundAdWrapper";
import SideAds from "./SideAds";

export default async function AdFetcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bgAds, sideAds] = await Promise.all([
    getAdvertisements("background", 1),
    getAdvertisements("sidebar", 1),
  ]);

  const backgroundAd = bgAds?.[0] || null;
  const sidebarAd = sideAds?.[0] || null;

  return (
    <BackgroundAdWrapper ad={backgroundAd}>
      <div className="min-h-screen relative">
        {children}
        <SideAds ad={sidebarAd} />
      </div>
    </BackgroundAdWrapper>
  );
}
