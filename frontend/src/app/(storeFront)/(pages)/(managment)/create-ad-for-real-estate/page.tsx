"use client";
import { useRouter } from "next/navigation";
import RealEstateForm from "@/app/(storeFront)/components/forms/RealEstateForm";

export default function CreateAdForRealEstatePage() {
  const router = useRouter();
  return <RealEstateForm onNext={() => router.push("/plan")} />;
}
