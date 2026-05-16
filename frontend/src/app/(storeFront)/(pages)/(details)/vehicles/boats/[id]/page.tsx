import { Suspense } from "react";
import { getBoatById } from "@/actions/categories/boatActions";
import { VehicleDetailsContent, VehicleDetailSkeleton } from "../../VehicleDetails";

export const revalidate = 60;

export default async function BoatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const data = await getBoatById(id);
    if (data) initialData = { data, type: "boat" as const };
  } catch {}
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailsContent forceType="boat" initialData={initialData} />
    </Suspense>
  );
}
