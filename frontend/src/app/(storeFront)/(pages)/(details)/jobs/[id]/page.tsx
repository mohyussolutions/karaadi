import { getJobById } from "@/actions/categories/jobActions";
import JobDetailsContent from "./JobDetailsContent";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await getJobById(id).catch(() => null);
  return <JobDetailsContent initialData={initialData} />;
}
