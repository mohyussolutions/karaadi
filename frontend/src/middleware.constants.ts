export const ROLE_ROUTES = [
  { pattern: "/dashboard", claim: "custom:isAdmin" },
  { pattern: "/devices", claim: "custom:isAdmin" },
  { pattern: "/managers", claim: "custom:isManager" },
  { pattern: "/support", claim: "custom:isSupport" },
] as const;

export const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/confirm",
  "/forgot-password",
  "/reset-password",
];

export const PUBLIC_PREFIXES = [
  ...AUTH_PREFIXES,
  "/marketplace",
  "/real-estate",
  "/cars",
  "/boats",
  "/farmequipment",
  "/motorcycles",
  "/jobs",
  "/about",
  "/help",
  "/contact",
  "/search",
  "/item",
  "/vehicles",
  "/item-details",
  "/Terms",
  "/privacy",
  "/cookies",
];

