import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      const exists = state.items.some((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) state.unreadCount += 1;
      }
    },
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((i) => !i.read).length;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    decrementUnread: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAllRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, read: true }));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  setUnreadCount,
  decrementUnread,
  markAllRead,
  clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
