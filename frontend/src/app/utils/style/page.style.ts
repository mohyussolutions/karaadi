export const page = {
  root:       "min-h-screen bg-gray-50",
  inner:      "max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-7",
  innerWide:  "max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-7",
  innerNarrow:"max-w-xl mx-auto px-4 py-8",
  header:     "sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center gap-3 shadow-sm",
  title:      "text-base font-black text-gray-900 leading-tight",
  subtitle:   "text-[11px] text-gray-400 font-medium leading-none mt-0.5",
  section:    "mb-8",
  sectionLabel:"text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1",
} as const;

export const detail = {
  root:        "min-h-screen bg-gray-50 pb-24",
  inner:       "max-w-5xl mx-auto px-3 sm:px-4 py-5",
  imageWrap:   "relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100",
  bodyGrid:    "grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5",
  main:        "lg:col-span-2 space-y-4",
  aside:       "space-y-4",
  infoCard:    "bg-white rounded-2xl border border-gray-200 shadow-sm p-5",
  price:       "text-3xl font-black text-blue-600",
  title:       "text-xl font-black text-gray-900 leading-snug mt-1",
  meta:        "flex items-center gap-2 text-sm text-gray-400 mt-2",
  sectionHead: "font-bold text-gray-900 text-sm mb-3",
  pill:        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold",
  pillActive:  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold",
} as const;

export const auth = {
  root:   "min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12",
  card:   "w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8",
  logo:   "flex items-center justify-center mb-6",
  title:  "text-2xl font-black text-gray-900 text-center mb-1",
  sub:    "text-sm text-gray-400 text-center mb-7",
  footer: "text-sm text-gray-500 text-center mt-6",
} as const;
