import { updateUserRole } from "core/utils/cognitoauth.ts";

export const handleRoleUpdate = async (
  token: string,
  email: string,
  rolesToUpdate: { isAdmin?: boolean; isManager?: boolean }
) => {
  if (rolesToUpdate) {
    await updateUserRole(token, email, rolesToUpdate);
  }
};
