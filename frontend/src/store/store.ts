import { configureStore, combineReducers } from "@reduxjs/toolkit";
import languageReducer from "./slices/reducers/languageSlice";
import listingDraftReducer from "./slices/reducers/listingDraftSlice";
import notificationsReducer from "./slices/reducers/notificationsSlice";
import wantedReducer from "./slices/reducers/wantedSlice";
import themeReducer from "./slices/reducers/themeSlice";
import dashboardReducer from "./slices/reducers/dashboardSlice";
import pushNotificationReducer from "./slices/reducers/pushNotificationSlice";
import notificationSettingsReducer from "./slices/reducers/notificationSettingsSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import listingDraftTransform from "./listingDraftTransform";

function createNoopStorage() {
  return {
    getItem: () => Promise.resolve(null),
    setItem: (_key: string, value: unknown) => Promise.resolve(value),
    removeItem: () => Promise.resolve(),
  };
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("session")
    : createNoopStorage();

const persistConfig = {
  key: "karaadi-root-v4",
  storage,
  whitelist: ["listingDraft"],
  transforms: [listingDraftTransform],
};

const rootReducer = combineReducers({
  language: languageReducer,
  listingDraft: listingDraftReducer,
  notifications: notificationsReducer,
  wanted: wantedReducer,
  theme: themeReducer,
  dashboard: dashboardReducer,
  pushNotification: pushNotificationReducer,
  notificationSettings: notificationSettingsReducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer<RootReducerState>(
  persistConfig,
  rootReducer as any,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
