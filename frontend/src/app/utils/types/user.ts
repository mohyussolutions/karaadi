export interface User {
  isSupport: boolean | undefined;
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  profileImage?: string;
  AccessToken?: string;
  storedRefreshToken?: string;
}

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">> & {
  _id: string;
};

export type AuthInput = {
  email: string;
  password: string;
};
