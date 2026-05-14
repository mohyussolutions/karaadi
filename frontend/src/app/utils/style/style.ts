// ─── Buttons ───────────────────────────────────────────────────────────────
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

  sm: "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors touch-manipulation",

  smOutline:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors touch-manipulation",

  smDanger:
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors touch-manipulation",
} as const;

// ─── Badges ────────────────────────────────────────────────────────────────
export const badge = {
  primary: "inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold",
  success: "inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold",
  warning: "inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold",
  danger:  "inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold",
  neutral: "inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold",
  premium: "inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold",
} as const;

// ─── Cards ─────────────────────────────────────────────────────────────────
export const card = {
  base:     "bg-white rounded-2xl border border-gray-200 shadow-sm",
  elevated: "bg-white rounded-2xl border border-gray-200 shadow-md",
  flat:     "bg-white rounded-2xl border border-gray-100",
  section:  "bg-gray-50 rounded-xl border border-gray-100",
  header:   "px-5 py-3.5 border-b border-gray-100 bg-gray-50",
  body:     "p-5",
  footer:   "px-5 py-4 border-t border-gray-100",
} as const;

// ─── Inputs ────────────────────────────────────────────────────────────────
export const input = {
  base:  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium outline-none transition-all bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400",
  error: "w-full px-3 py-2.5 border border-red-400 rounded-lg text-sm font-medium outline-none transition-all bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400",
  label: "block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2",
} as const;

// ─── Text ──────────────────────────────────────────────────────────────────
export const text = {
  heading:    "text-xl font-black text-gray-900 leading-tight",
  subheading: "text-base font-bold text-gray-800",
  body:       "text-sm text-gray-600",
  small:      "text-xs text-gray-400",
  label:      "text-[10px] font-black text-gray-400 uppercase tracking-widest",
  link:       "text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors",
  error:      "text-red-500 text-xs font-medium mt-1",
} as const;

// ─── Divider ───────────────────────────────────────────────────────────────
export const divider = {
  horizontal: "border-t border-gray-100",
  vertical:   "border-l border-gray-100 h-full",
} as const;
