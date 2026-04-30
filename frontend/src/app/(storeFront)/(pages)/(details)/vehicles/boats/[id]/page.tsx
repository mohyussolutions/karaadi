"use client";

import { Suspense } from "react";
import Loading from "@/app/ui/loading/Loading";
import { VehicleDetailsContent } from "../../VehicleDetails";

export default function BoatDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loading /></div>}>
      <VehicleDetailsContent forceType="boat" />
    </Suspense>
  );
}
