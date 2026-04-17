import { User } from "@prisma/client";
import { TFunction } from "i18next";

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        isAdmin: boolean;
        isManager: boolean;
        isSupport: boolean;
        ["custom:isAdmin"]?: string;
        ["custom:isManager"]?: string;
        ["custom:isSupport"]?: string;
      };
      accessToken?: string;
      t: TFunction;
    }
  }
}

export {};
