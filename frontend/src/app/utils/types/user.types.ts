export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  isAdmin: boolean;
  isSupport: boolean;
  isManager: boolean;
  accessToken?: string;
  refreshToken?: string;
  phone: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  token: string;
  expiresIn?: number;
}

export interface NormalizedUser {
  _id: string;
  username: string;
  email: string;
  profileImage: string | null;
  phone: string;
  phoneVerified: boolean;
  emailVerified?: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  isAdmin: boolean;
  isManager: boolean;
  isSupport: boolean;
}

export interface RawUserData {
  _id?: string;
  id?: string;
  sub?: string;
  username?: string;
  preferred_username?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  phoneVerified?: boolean | string;
  emailVerified?: boolean | string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  isAdmin?: boolean | string;
  isManager?: boolean | string;
  isSupport?: boolean | string;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: any;
}

export interface SessionResponse {
  user?: RawUserData;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}
