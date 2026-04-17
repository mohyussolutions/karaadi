import { getCars } from "@/actions/categories/carActions";
import TruckClient from "./TruckClient";

export const revalidate = 60;

export default async function TruckPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <TruckClient initialData={data ?? []} />;
}
