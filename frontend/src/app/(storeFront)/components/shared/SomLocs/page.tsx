"use client";
export const dynamic = "force-dynamic";
import SomaliMap from "./SomaliMap";

export default function Page() {
  return (
    <SomaliMap selectedRegion={null} onRegionClick={() => {}} items={[]} />
  );
}
