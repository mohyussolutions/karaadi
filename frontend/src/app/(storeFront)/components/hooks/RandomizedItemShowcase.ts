import {
  getPriorityLevel,
  PriorityItem,
} from "@/app/utils/types/priority.types";
import { useEffect, useState, useRef } from "react";

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const useRandomizedItems = <T>(items: T[]) => {
  const [shuffledItems, setShuffledItems] = useState<T[]>(items);
  const hasRandomized = useRef(false);

  useEffect(() => {
    if (!hasRandomized.current && items.length > 0) {
      hasRandomized.current = true;
      setShuffledItems(shuffleArray(items));
    }
  }, [items]);

  return shuffledItems;
};

export const groupByPriorityAndRandomize = <T extends PriorityItem>(
  items: T[],
): T[] => {
  const premium: T[] = [];
  const standard: T[] = [];
  const basic: T[] = [];
  const others: T[] = [];

  items.forEach((item) => {
    const level = getPriorityLevel(item);
    if (level === "PREMIUM") premium.push(item);
    else if (level === "STANDARD") standard.push(item);
    else if (level === "BASIC") basic.push(item);
    else others.push(item);
  });

  return [
    ...shuffleArray(premium),
    ...shuffleArray(standard),
    ...shuffleArray(basic),
    ...shuffleArray(others),
  ];
};
