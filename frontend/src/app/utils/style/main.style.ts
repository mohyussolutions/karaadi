export const main = {
  page:    "space-y-6 sm:space-y-8 min-h-screen",
  catWrap: "min-h-[192px] sm:min-h-[204px]",
} as const;

export const mainStyle = {
  pagePadding: { paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" },
} as const;

export const inputCls = "w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400";
