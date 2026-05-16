import { Suspense } from "react";
import { getCarById } from "@/actions/categories/carActions";
import { VehicleDetailsContent, VehicleDetailSkeleton } from "../../VehicleDetails";

export const revalidate = 60;

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const data = await getCarById(id);
    if (data) initialData = { data, type: "car" as const };
  } catch {}
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailsContent forceType="car" initialData={initialData} />
    </Suspense>
  );
}
