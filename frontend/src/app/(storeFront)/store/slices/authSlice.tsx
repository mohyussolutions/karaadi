import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  userInfo: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
      state.status = "authenticated";
    },
    logout(state) {
      state.userInfo = null;
      state.status = "unauthenticated";
    },
    setStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;
