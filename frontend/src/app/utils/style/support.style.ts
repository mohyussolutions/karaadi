export const modal = {
  backdrop: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4",
  box:      "w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden",
  header:   "px-6 py-4 border-b border-gray-100 flex items-center justify-between",
  title:    "font-bold text-gray-900 text-base",
  body:     "px-6 py-5",
  footer:   "px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3",
  close:    "inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors",
} as const;

export const alert = {
  info:    "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm",
  success: "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm",
  warning: "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm",
  danger:  "flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm",
  icon:    "flex-shrink-0 mt-0.5",
  text:    "flex-1 font-medium",
  title:   "font-bold mb-0.5",
} as const;

export const toast = {
  root:    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center",
  base:    "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold min-w-[240px] max-w-sm",
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
  info:    "bg-blue-600 text-white",
  neutral: "bg-gray-800 text-white",
} as const;

export const empty = {
  root:    "flex flex-col items-center justify-center py-20 text-center px-4",
  icon:    "w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-2xl text-gray-400",
  title:   "font-bold text-gray-700 text-base mb-1",
  sub:     "text-sm text-gray-400",
  action:  "mt-5",
} as const;

export const help = {
  card:    "bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow",
  icon:    "w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl mb-4",
  title:   "font-bold text-gray-900 text-base mb-1",
  text:    "text-sm text-gray-500",
  faq:     "border-b border-gray-100 last:border-0",
  q:       "flex items-center justify-between gap-3 py-4 cursor-pointer font-semibold text-gray-900 text-sm",
  a:       "pb-4 text-sm text-gray-500 leading-relaxed",
} as const;
