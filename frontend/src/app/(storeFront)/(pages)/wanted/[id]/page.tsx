import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import WantedDetailContent from "./WantedDetailContent";

export const revalidate = 60;

export default async function WantedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData = null;
  try {
    const res = await fetch(`${BASE_API_URL}/api/wanted/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) initialData = await res.json();
  } catch {}
  return <WantedDetailContent initialData={initialData} />;
}
