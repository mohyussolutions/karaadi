export function normalizeUser(u: any) {
  if (!u) return null;

  const toBool = (v: any) => v === true || v === "true";

  return {
    ...u,
    isAdmin: toBool(u.isAdmin) || toBool(u["custom:isAdmin"]),
    isManager: toBool(u.isManager) || toBool(u["custom:isManager"]),
    isSupport: toBool(u.isSupport) || toBool(u["custom:isSupport"]),
  };
}
