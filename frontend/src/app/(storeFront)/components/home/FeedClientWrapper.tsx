"use client";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import FeedClient from "./FeedClient";

export default function FeedClientWrapper({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  return <FeedClient initialItems={initialItems} />;
}
