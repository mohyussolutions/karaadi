"use client";
import FeedClient from "./FeedClient";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

export default function FeedClientWrapper({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  return <FeedClient initialItems={initialItems} />;
}
