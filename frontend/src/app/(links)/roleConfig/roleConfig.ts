export const DASHBOARD_ROLES = [{ path: "/dashboard", role: "admin" }];
export const SUPPORT_ROLES = [{ path: "/support", role: "support" }];
export const MANAGER_ROLES = [{ path: "/managers", role: "manager" }];
export const BACKOFFICE_ROLES = [{ path: "/backoffice", role: "backoffice" }];
export const DEVICE_ROLES = [{ path: "/devices", role: "devices" }];

export const ALL_PROTECTED_PATHS = [
  ...DASHBOARD_ROLES,
  ...SUPPORT_ROLES,
  ...MANAGER_ROLES,
  ...BACKOFFICE_ROLES,
  ...DEVICE_ROLES,
];
