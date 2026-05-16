import { getRoleHome } from "@/middleware.constants";

export type UserRole = "admin" | "manager" | "support" | "user";

export function resolveRole(user: {
  isAdmin?: boolean;
  isManager?: boolean;
  isSupport?: boolean;
}): UserRole {
  if (user.isAdmin) return "admin";
  if (user.isManager) return "manager";
  if (user.isSupport) return "support";
  return "user";
}

export { getRoleHome };
