import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "karaadi-sound-enabled";

export const soundStorage = {
  get: (): boolean => {
    if (typeof window === "undefined") return true;
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === "true";
  },
  set: (enabled: boolean): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  },
};

interface NotificationSettingsState {
  soundEnabled: boolean;
}

const initialState: NotificationSettingsState = {
  soundEnabled: true,
};

const notificationSettingsSlice = createSlice({
  name: "notificationSettings",
  initialState,
  reducers: {
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
      soundStorage.set(action.payload);
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      soundStorage.set(state.soundEnabled);
    },
    hydrateFromStorage: (state) => {
      state.soundEnabled = soundStorage.get();
    },
  },
});

export const { setSoundEnabled, toggleSound, hydrateFromStorage } =
  notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
