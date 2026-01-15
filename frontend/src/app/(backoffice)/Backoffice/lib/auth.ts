import { apiService } from "@/actions/core/authAction";

export type BackofficeUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  isAdmin?: boolean;
  isManager?: boolean;
  isSupport?: boolean;
  [k: string]: any;
};

export async function getCurrentUser(): Promise<null | { user: BackofficeUser; role: string | null }> {
  try {
    const user = await apiService.verifySession();
    if (!user) return null;

    let role: string | null = null;
    if (user.isAdmin) role = "admin";
    else if (user.isManager) role = "manager";
    else if (user.isSupport) role = "support";

    return { user, role };
  } catch (err) {
    return null;
  }
}
