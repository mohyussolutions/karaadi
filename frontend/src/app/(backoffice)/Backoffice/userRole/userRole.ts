import { verifySession } from "@/actions/core/authAction";

async function getCurrentUser() {
  const user = await verifySession();

  if (!user) {
    console.log("No user logged in");
    return null;
  }

  let role = null;
  if (user.isAdmin) role = "admin";
  else if (user.isManager) role = "manager";
  else if (user.isSupport) role = "support";

  return { user, role };
}

export { getCurrentUser };
