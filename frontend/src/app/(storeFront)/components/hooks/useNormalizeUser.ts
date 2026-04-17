import { NormalizedUser, RawUserData } from "@/app/utils/types/user.types";
import { toBool } from "./helpers";

export function normalizeUser(u: RawUserData): NormalizedUser | null {
  if (!u) return null;

  let profileImage: string | undefined = u.profileImage;
  if (
    typeof profileImage === "string" &&
    (profileImage === "false" || profileImage.trim() === "")
  ) {
    profileImage = undefined;
  }

  return {
    _id: u.id || u._id || u.sub || "",
    id: u.id || u._id || u.sub || "",
    username:
      u.username || u.preferred_username || u.email?.split("@")[0] || "",
    email: u.email || "",
    profileImage,
    phone: u.phone || "",
    phoneVerified: toBool(u.phoneVerified),
    token: u.token || "",
    accessToken: u.accessToken || "",
    refreshToken: u.refreshToken || "",
    isAdmin: toBool(u.isAdmin) || toBool(u["custom:isAdmin"]),
    isManager: toBool(u.isManager) || toBool(u["custom:isManager"]),
    isSupport: toBool(u.isSupport) || toBool(u["custom:isSupport"]),
    expiresIn: u.expiresIn,
  };
}
