import { updateUserRole } from "../utils/cognitoauth.ts";

export const handleRoleUpdate = async (
  token: string,
  email: string,
  rolesToUpdate?: {
    isAdmin?: boolean;
    isManager?: boolean;
    isSupport?: boolean;
  },
) => {
  if (rolesToUpdate) {
    const stringRoles = {
      isAdmin:
        rolesToUpdate.isAdmin !== undefined
          ? rolesToUpdate.isAdmin.toString()
          : undefined,
      isManager:
        rolesToUpdate.isManager !== undefined
          ? rolesToUpdate.isManager.toString()
          : undefined,
      isSupport:
        rolesToUpdate.isSupport !== undefined
          ? rolesToUpdate.isSupport.toString()
          : undefined,
    };

    await updateUserRole(token, email, stringRoles);
  }
};
