import { getCars } from "@/actions/categories/carActions";
import TrailersClient from "./TrailersClient";

export const revalidate = 60;

export default async function TrailersPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <TrailersClient initialData={data ?? []} />;
}
