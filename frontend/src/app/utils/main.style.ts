export const main = {
  page:    "space-y-6 sm:space-y-8 min-h-screen",
  catWrap: "min-h-[192px] sm:min-h-[204px]",
} as const;

export const mainStyle = {
  pagePadding: { paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" },
} as const;
