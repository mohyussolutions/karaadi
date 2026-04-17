export const PRIORITY = {
  PREMIUM: "isPremium90",
  STANDARD: "isStandard60",
  BASIC: "isBasic30",
} as const;

export const PRIORITY_ORDER = {
  PREMIUM: 1,
  STANDARD: 2,
  BASIC: 3,
} as const;

export type PriorityType = keyof typeof PRIORITY;
export type PriorityFlag = (typeof PRIORITY)[PriorityType];

export interface PriorityItem {
  [PRIORITY.PREMIUM]?: boolean;
  [PRIORITY.STANDARD]?: boolean;
  [PRIORITY.BASIC]?: boolean;
}

export const getPriorityLevel = (item: PriorityItem): PriorityType | null => {
  if (item[PRIORITY.PREMIUM]) return "PREMIUM";
  if (item[PRIORITY.STANDARD]) return "STANDARD";
  if (item[PRIORITY.BASIC]) return "BASIC";
  return null;
};
