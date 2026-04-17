export type RawUserData = {
  id?: string;
  _id?: string;
  sub?: string;
  username?: string;
  preferred_username?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  phoneVerified?: boolean | string | number;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  isAdmin?: boolean | string | number;
  isManager?: boolean | string | number;
  isSupport?: boolean | string | number;
  [key: string]: any;
};

export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  isAdmin: boolean;
  isSupport: boolean;
  isManager: boolean;
  accessToken?: string;
  refreshToken?: string;
  phone: string;
  phoneVerified: boolean;
  token: string;
  expiresIn?: number;
}

export interface NormalizedUser extends User {
  emailVerified?: boolean;
}

export interface LoginResponse {
  user: NormalizedUser;
  token: string;
  expiresIn?: number;
}
