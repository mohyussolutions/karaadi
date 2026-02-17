import { configureStore, combineReducers } from "@reduxjs/toolkit";
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

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : {
        getItem: (_key: any) => Promise.resolve(null),
        setItem: (_key: any, value: any) => Promise.resolve(value),
        removeItem: (_key: any) => Promise.resolve(),
      };

import planReducer from "./slices/planSlice";
import boatsReducer from "./slices/boatsSlice";
import carsReducer from "./slices/carsSlice";
import marketplaceReducer from "./slices/marketplaceSlice";
import motorcyclesReducer from "./slices/motorcyclesSlice";
import realEstateReducer from "./slices/realEstateSlice";
import tractorsReducer from "./slices/traktorsSlice";
import authReducer from "./slices/authSlice";
import feesReducer from "./slices/feesSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "auth",
    "plan",
    "boats",
    "fees",
    "cars",
    "marketplace",
    "motorcycles",
    "realEstate",
    "tractors",
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  plan: planReducer,
  boats: boatsReducer,
  fees: feesReducer,
  cars: carsReducer,
  marketplace: marketplaceReducer,
  motorcycles: motorcyclesReducer,
  realEstate: realEstateReducer,
  tractors: tractorsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
