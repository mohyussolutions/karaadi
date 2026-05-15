import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PushNotificationState {
  enabled: boolean;
  subscribed: boolean;
  permission: string;
  loading: boolean;
}

const initialState: PushNotificationState = {
  enabled: false,
  subscribed: false,
  permission: "default",
  loading: false,
};

const pushNotificationSlice = createSlice({
  name: "pushNotification",
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.subscribed = action.payload;
    },
    setPermission: (state, action: PayloadAction<string>) => {
      state.permission = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setEnabled, setSubscribed, setPermission, setLoading } = pushNotificationSlice.actions;
export default pushNotificationSlice.reducer;
