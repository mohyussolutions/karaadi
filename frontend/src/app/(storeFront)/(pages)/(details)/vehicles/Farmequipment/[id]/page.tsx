import { Suspense } from "react";
import { getFarmEquipmentById } from "@/actions/categories/FarmequipmentAction";
import { VehicleDetailsContent, VehicleDetailSkeleton } from "../../VehicleDetails";

export const revalidate = 60;

export default async function FarmEquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const data = await getFarmEquipmentById(id);
    if (data) initialData = { data, type: "farmequipment" as const };
  } catch {}
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailsContent forceType="farmequipment" initialData={initialData} />
    </Suspense>
  );
}
