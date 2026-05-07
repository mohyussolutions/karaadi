"use client";
import dynamic from "next/dynamic";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const FeedClient = dynamic(() => import("./FeedClient"), { ssr: false });

export default function FeedClientWrapper({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  return <FeedClient initialItems={initialItems} />;
}
