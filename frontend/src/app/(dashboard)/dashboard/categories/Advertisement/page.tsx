import { Suspense } from "react";
import AdvertisementManager from "./AdvertisementManager";

export default function AdvertisementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdvertisementManager />
    </Suspense>
  );
}
