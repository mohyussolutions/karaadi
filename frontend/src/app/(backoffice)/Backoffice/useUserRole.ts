import { DASHBOARD_ROLES, UserRole } from "@/app/(links)/roleConfig/roleConfig";

export const getActiveRole = (pathname: string): UserRole => {
  const match = DASHBOARD_ROLES.find((config) =>
    pathname.startsWith(config.path),
  );
  return match ? match.role : "manager";
};
