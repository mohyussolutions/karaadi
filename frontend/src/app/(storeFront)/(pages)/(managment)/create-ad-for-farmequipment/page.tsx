"use client";
import { useRouter } from "next/navigation";
import FarmEquipmentForm from "@/app/(storeFront)/components/forms/FarmEquipmentForm";

export default function CreateAdForFarmEquipmentPage() {
  const router = useRouter();
  return <FarmEquipmentForm onNext={() => router.push("/plan")} />;
}
