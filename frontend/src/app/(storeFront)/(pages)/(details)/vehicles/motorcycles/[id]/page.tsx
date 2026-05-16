import { Suspense } from "react";
import { getMotorcycleById } from "@/actions/categories/motorcycleActions";
import { VehicleDetailsContent, VehicleDetailSkeleton } from "../../VehicleDetails";

export const revalidate = 60;

export default async function MotorcycleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const data = await getMotorcycleById(id);
    if (data) initialData = { data, type: "motorcycle" as const };
  } catch {}
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailsContent forceType="motorcycle" initialData={initialData} />
    </Suspense>
  );
}
