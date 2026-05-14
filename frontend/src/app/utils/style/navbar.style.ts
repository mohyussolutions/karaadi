export const navbar = {
  root:       "fixed top-0 left-0 w-full z-[9999] bg-white border-b border-gray-200 pointer-events-auto",
  inner:      "flex justify-between items-center max-w-[64.5rem] w-full mx-auto px-3 sm:px-4 md:px-6 h-12",
  logo:       "font-black text-blue-600 text-xl tracking-tight",
  link:       "text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors",
  linkActive: "text-sm font-semibold text-blue-600",
  iconBtn:    "inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors touch-manipulation",
  dropdown:   "absolute top-full right-0 mt-1 bg-white rounded-2xl border border-gray-200 shadow-lg z-50 overflow-hidden min-w-[200px]",
  dropItem:   "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors",
  badge:      "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center",
} as const;

export const subnavbar = {
  root:    "sticky top-12 z-40 bg-white border-b border-gray-100 shadow-sm",
  inner:   "flex items-center gap-1 px-3 sm:px-4 max-w-7xl mx-auto overflow-x-auto scrollbar-hide py-2",
  tab:     "flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap",
  tabActive: "flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white whitespace-nowrap",
} as const;

export const sidebar = {
  root:    "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col",
  header:  "px-5 py-4 border-b border-gray-100",
  body:    "flex-1 overflow-y-auto py-3",
  footer:  "px-4 py-4 border-t border-gray-100",
  link:    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors mx-2",
  linkActive: "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 mx-2",
  section: "px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 mb-1",
} as const;
