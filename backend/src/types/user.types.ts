import { Request } from "express";
import { User } from "@prisma/client";
import { TFunction } from "i18next";

export interface AuthUser extends User {
  _id?: string;
  sub?: string;
  isAdmin: boolean;
  isManager: boolean;
  isSupport: boolean;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  accessToken?: string;
  t: TFunction;
}

export interface DecodedToken {
  sub: string;
  email?: string;
  preferred_username?: string;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
  exp: number;
  iat: number;
}

export interface VerifiedTokenData {
  _id?: string;
  sub: string;
  "custom:isAdmin": string;
  "custom:isManager": string;
  email: string;
  "custom:isSupport"?: string;
  preferred_username?: string;
  username: string;
  token?: string;
}

export interface RoleUpdateData {
  isAdmin?: string;
  isManager?: string;
  isSupport?: string;
}

export interface UserAttributes {
  email?: string;
  preferred_username?: string;
  phone_number?: string;
  profile?: string;
  phone_number_verified?: string;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
  "custom:phone_number"?: string;
  "custom:profile"?: string;
}

export interface validateProps {
  username?: string;
  email: string;
  password: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string;
  createdAt: Date;
  price?: number;
  salary?: number;
  [key: string]: any;
}
