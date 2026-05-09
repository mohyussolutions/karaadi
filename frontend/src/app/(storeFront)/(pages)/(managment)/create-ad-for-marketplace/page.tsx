"use client";
import { useRouter } from "next/navigation";
import MarketplaceForm from "@/app/(storeFront)/components/forms/MarketplaceForm";

export default function CreateAdForMarketplacePage() {
  const router = useRouter();
  return <MarketplaceForm onNext={() => router.push("/plan")} />;
}
