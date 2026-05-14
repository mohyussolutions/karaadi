export const btn = {
  primary:     "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:   "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  outline:     "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  success:     "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  danger:      "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:       "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  icon:        "inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors touch-manipulation",
  iconSm:      "inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors touch-manipulation",
  sm:          "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors touch-manipulation",
  smOutline:   "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors touch-manipulation",
  smDanger:    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors touch-manipulation",
  smSuccess:   "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors touch-manipulation",
  wide:        "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  wideDanger:  "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  wideSuccess: "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  wideOutline: "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors touch-manipulation",
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
  price:      "text-2xl font-black text-blue-600",
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

export const auth = {
  root:       "min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12",
  card:       "w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8",
  title:      "text-2xl font-black text-gray-900 text-center mb-1",
  subtitle:   "text-sm text-gray-400 text-center mb-7",
  form:       "space-y-4",
  field:      "flex flex-col gap-1.5",
  pwWrap:     "relative",
  pwToggle:   "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors",
  submit:     "w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl transition-colors text-sm touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed",
  divider:    "flex items-center gap-3 my-4",
  dividerLine:"flex-1 border-t border-gray-200",
  dividerText:"text-xs text-gray-400 font-semibold",
  footer:     "text-sm text-gray-500 text-center mt-6",
  footerLink: "text-blue-600 hover:text-blue-700 font-semibold transition-colors",
  errorBox:   "flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium",
  successBox: "flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium",
} as const;

export const ads = {
  root:       "min-h-screen bg-gray-50",
  inner:      "max-w-4xl mx-auto px-3 sm:px-4 py-5",
  header:     "sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center gap-3 shadow-sm",
  headerTitle:"text-base font-black text-gray-900 leading-tight",
  grid:       "grid grid-cols-2 sm:grid-cols-3 gap-3",
  listCard:   "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden active:scale-[0.98] transition-transform touch-manipulation",
  listImg:    "relative w-full aspect-[4/3] bg-gray-100",
  listBody:   "p-3",
  listTitle:  "font-bold text-gray-900 text-sm leading-snug line-clamp-2",
  listPrice:  "text-blue-600 font-black text-base mt-1",
  listMeta:   "flex items-center gap-1.5 text-xs text-gray-400 mt-1.5",
  detailImg:  "relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100",
  detailTitle:"text-xl font-black text-gray-900 leading-snug",
  detailPrice:"text-3xl font-black text-blue-600 mt-1",
  detailMeta: "flex items-center gap-3 text-sm text-gray-400 mt-2 flex-wrap",
  detailBody: "grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5",
  detailMain: "lg:col-span-2 space-y-4",
  detailAside:"space-y-4",
  pill:       "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold",
  pillActive: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold",
  featuredBadge:"absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black",
  soldBadge:  "absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gray-800 text-white text-[10px] font-black",
} as const;

export const msg = {
  root:         "flex flex-col h-full bg-white",
  list:         "flex-1 overflow-y-auto px-4 py-3 space-y-2",
  bubbleOut:    "flex justify-end",
  bubbleIn:     "flex justify-start",
  bubbleTextOut:"max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-blue-600 text-white text-sm font-medium leading-relaxed",
  bubbleTextIn: "max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-gray-100 text-gray-900 text-sm font-medium leading-relaxed",
  time:         "text-[10px] text-gray-400 mt-0.5 px-1",
  inputWrap:    "px-3 py-3 border-t border-gray-100 flex items-center gap-2",
  inputField:   "flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white",
  sendBtn:      "inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors touch-manipulation disabled:opacity-40",
  convRow:      "flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-50 last:border-0",
  convAvatar:   "w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0",
  convName:     "font-semibold text-gray-900 text-sm",
  convPreview:  "text-xs text-gray-400 truncate mt-0.5",
  convTime:     "text-[10px] text-gray-400 flex-shrink-0",
  unreadDot:    "w-2 h-2 rounded-full bg-blue-600 flex-shrink-0",
  unreadBadge:  "px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black min-w-[18px] text-center",
} as const;

export const notif = {
  dropdown:   "absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-lg z-50 overflow-hidden",
  header:     "px-4 py-3 border-b border-gray-100 flex items-center justify-between",
  title:      "font-bold text-gray-900 text-sm",
  markAll:    "text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors",
  list:       "max-h-80 overflow-y-auto",
  item:       "flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0",
  itemUnread: "flex items-start gap-3 px-4 py-3.5 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border-b border-blue-50 last:border-0",
  icon:       "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
  iconBlue:   "w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0",
  iconGreen:  "w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0",
  iconRed:    "w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0",
  body:       "flex-1 min-w-0",
  bodyTitle:  "text-sm font-semibold text-gray-900 leading-snug",
  bodyText:   "text-xs text-gray-400 mt-0.5 leading-relaxed",
  bodyTime:   "text-[10px] text-gray-400 mt-1",
  dot:        "w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5",
  badge:      "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center",
  empty:      "flex flex-col items-center justify-center py-10 text-center px-4",
  emptyText:  "text-sm font-semibold text-gray-500 mt-2",
  footer:     "px-4 py-3 border-t border-gray-100 text-center",
  footerLink: "text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors",
} as const;

export const modal = {
  backdrop: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4",
  box:      "w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden",
  header:   "px-6 py-4 border-b border-gray-100 flex items-center justify-between",
  title:    "font-bold text-gray-900 text-base",
  close:    "inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors",
  body:     "px-6 py-5",
  footer:   "px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3",
} as const;

export const nav = {
  root:       "fixed top-0 left-0 w-full z-[9999] bg-white border-b border-gray-200",
  inner:      "flex justify-between items-center max-w-[64.5rem] w-full mx-auto px-3 sm:px-4 md:px-6 h-12",
  link:       "text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors",
  linkActive: "text-sm font-semibold text-blue-600",
  iconBtn:    "inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors touch-manipulation",
  dropdown:   "absolute top-full right-0 mt-1 bg-white rounded-2xl border border-gray-200 shadow-lg z-50 overflow-hidden min-w-[200px]",
  dropItem:   "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors",
  sidebar:    "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col",
  sideLink:   "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors mx-2",
  sideLinkActive:"flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 mx-2",
  sideSection:"px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 mb-1",
} as const;

export const profile = {
  root:       "max-w-2xl mx-auto px-4 py-8 space-y-5",
  card:       "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
  avatar:     "w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center",
  avatarSm:   "w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center",
  name:       "text-xl font-black text-gray-900",
  email:      "text-sm text-gray-400",
  sectionHead:"px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between",
  sectionTitle:"font-bold text-gray-900 text-sm",
  row:        "flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-50 last:border-0",
  rowLabel:   "text-[10px] font-black text-gray-400 uppercase tracking-widest",
  rowValue:   "text-sm font-semibold text-gray-900",
  dangerZone: "px-5 py-4 bg-red-50 border-t border-red-100",
  dangerText: "text-sm font-semibold text-red-700 mb-3",
} as const;

export const empty = {
  root:  "flex flex-col items-center justify-center py-20 text-center px-4",
  icon:  "w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl text-gray-400 mb-4",
  title: "font-bold text-gray-700 text-base mb-1",
  sub:   "text-sm text-gray-400",
  cta:   "mt-5",
} as const;

export const listRow =
  "w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation select-none";

export const sectionLabel =
  "text-[10px] font-black text-gray-400 uppercase tracking-widest";
