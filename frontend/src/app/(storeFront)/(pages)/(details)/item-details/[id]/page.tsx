import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import ProductDetailsContent from "./ProductDetailsContent";

export const revalidate = 60;

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const res = await fetch(`${API}/api/items/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) initialData = await res.json();
  } catch {}
  return <ProductDetailsContent initialData={initialData} />;
}
