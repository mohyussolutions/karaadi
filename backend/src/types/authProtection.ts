import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: User & {
    id: string;
    email: string | null;
    username: string;
    isAdmin: boolean;
    isManager: boolean;
    isSupport: boolean;
    "custom:isAdmin"?: string;
    "custom:isManager"?: string;
    "custom:isSupport"?: string;
  };
  accessToken?: string;
}

export interface DecodedToken {
  sub: string;
  email?: string;
  preferred_username?: string;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
}
