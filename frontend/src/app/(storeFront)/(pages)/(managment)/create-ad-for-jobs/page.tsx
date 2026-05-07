"use client";
import { useRouter } from "next/navigation";
import JobsForm from "@/app/(storeFront)/components/forms/JobsForm";

export default function CreateAdForJobsPage() {
  const router = useRouter();
  return <JobsForm onNext={() => router.push("/jobs")} />;
}
