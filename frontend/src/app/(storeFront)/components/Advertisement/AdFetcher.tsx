import { getAdvertisements } from "@/actions/categories/advertisementService";
import BackgroundAdWrapper from "./BackgroundAdWrapper";
import SideAds from "./SideAds";

const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
  Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

export default async function AdFetcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bgAds, sideAds] = await Promise.all([
    withTimeout(getAdvertisements("background", 1), 2000, []),
    withTimeout(getAdvertisements("sidebar", 1), 2000, []),
  ]);

  const backgroundAd = bgAds?.[0] ?? null;
  const sidebarAd = sideAds?.[0] ?? null;

  return (
    <BackgroundAdWrapper ad={backgroundAd}>
      <div className="min-h-screen relative">
        {children}
        <SideAds ad={sidebarAd} />
      </div>
    </BackgroundAdWrapper>
  );
}
