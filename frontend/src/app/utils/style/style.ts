export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  secondary:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  outline:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  success:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  danger:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  ghost:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  icon: "inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors touch-manipulation",

  iconSm: "inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors touch-manipulation",

  sm:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors touch-manipulation",

  smOutline:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors touch-manipulation",

  smDanger:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors touch-manipulation",

  smSuccess:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors touch-manipulation",

  wide:
    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  wideDanger:
    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  wideSuccess:
    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",

  wideOutline:
    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors touch-manipulation",
} as const;

export const badge = {
  primary: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold",
  success: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold",
  warning: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold",
  danger:  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold",
  neutral: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold",
  premium: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold",
  free:    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold",
} as const;

export const card = {
  base:     "bg-white rounded-2xl border border-gray-200 shadow-sm",
  elevated: "bg-white rounded-2xl border border-gray-200 shadow-md",
  flat:     "bg-white rounded-2xl border border-gray-100",
  section:  "bg-gray-50 rounded-xl border border-gray-100",
  header:   "px-5 py-3.5 border-b border-gray-100 bg-gray-50",
  body:     "p-5",
  footer:   "px-5 py-4 border-t border-gray-100",
} as const;

export const input = {
  base:     "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium outline-none transition-all bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400",
  error:    "w-full px-3 py-2.5 border border-red-400 rounded-lg text-sm font-medium outline-none transition-all bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400",
  label:    "block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2",
  select:   "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none",
  textarea: "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium outline-none transition-all bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 resize-none",
  helper:   "text-[10px] text-gray-400 mt-1.5 leading-relaxed",
  errorMsg: "text-red-500 text-xs font-medium mt-1",
} as const;

export const text = {
  heading:    "text-xl font-black text-gray-900 leading-tight",
  subheading: "text-base font-bold text-gray-800",
  body:       "text-sm text-gray-600",
  small:      "text-xs text-gray-400",
  label:      "text-[10px] font-black text-gray-400 uppercase tracking-widest",
  link:       "text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors",
  error:      "text-red-500 text-xs font-medium mt-1",
  muted:      "text-gray-400 text-sm",
} as const;

export const divider = {
  x: "border-t border-gray-100",
  y: "border-l border-gray-100 self-stretch",
} as const;

export const overlay = {
  base:    "absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl z-50",
  dark:    "absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50",
  spinner: "animate-spin h-9 w-9 border-[3px] border-blue-600 border-t-transparent rounded-full",
} as const;

export const listRow =
  "w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation select-none";

export const sectionLabel =
  "text-[10px] font-black text-gray-400 uppercase tracking-widest";
