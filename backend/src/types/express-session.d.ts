import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      sub: string;
      email: string;
      username?: string;
      phone?: string;
      profileImage?: string;
      isAdmin: boolean;
      isManager: boolean;
      isSupport: boolean;
    };
    idToken?: string;
    refreshToken?: string;
    accessToken?: string;
  }
}
