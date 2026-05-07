"use client";
import { useRouter } from "next/navigation";
import CarsForm from "@/app/(storeFront)/components/forms/CarsForm";

export default function CreateAdForCarsPage() {
  const router = useRouter();
  return <CarsForm onNext={() => router.push("/plan")} />;
}
