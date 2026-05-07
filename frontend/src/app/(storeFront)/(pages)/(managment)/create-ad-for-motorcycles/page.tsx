"use client";
import { useRouter } from "next/navigation";
import MotorcyclesForm from "@/app/(storeFront)/components/forms/MotorcyclesForm";

export default function CreateAdForMotorcyclesPage() {
  const router = useRouter();
  return <MotorcyclesForm onNext={() => router.push("/plan")} />;
}
