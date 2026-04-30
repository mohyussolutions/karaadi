"use client";
import dynamic from "next/dynamic";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

// ssr:false avoids hydration mismatch on linkHref between server HTML and client bundle
const FeedClient = dynamic(() => import("./FeedClient"), { ssr: false });

export default function FeedClientWrapper({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  return <FeedClient initialItems={initialItems} />;
}
