import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        ["custom:isAdmin"]?: string;
        ["custom:isManager"]?: string;
        ["custom:isSupport"]?: string;
      };
      accessToken?: string;
    }
  }
}
