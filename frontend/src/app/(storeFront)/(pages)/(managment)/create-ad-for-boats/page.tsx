"use client";
import { useRouter } from "next/navigation";
import BoatsForm from "@/app/(storeFront)/components/forms/BoatsForm";

export default function CreateAdForBoatsPage() {
  const router = useRouter();
  return <BoatsForm onNext={() => router.push("/plan")} />;
}
