import { getRealEstateById } from "@/actions/categories/realEstateActions";
import RealEstateDetailsContent from "./RealEstateDetailsContent";

export const revalidate = 300;

export default async function RealEstateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await getRealEstateById(id).catch(() => null);
  return <RealEstateDetailsContent initialData={initialData} />;
}
