import { configureStore } from "@reduxjs/toolkit";
import { marketplaceApi } from "./slices/marketplaceSlice";
import { realEstateApi } from "./slices/realtStateSlice";
import { boatsApi } from "./slices/boatsSlice";
import { carsApi } from "./slices/carsSlice";
import { motorcyclesApi } from "./slices/motorcyclesSlice";
import { tractorsApi } from "./slices/tractorsSlice";
import { chatApi } from "./slices/chatSlice";
import { userApi } from "./slices/userSlice";
import { subscriptionApi } from "./slices/subscriptionSlice";
import subscriptionFormReducer from "./slices/subscriptionFormSlice";
import { paymentApi, paymentReducer } from "./slices/paymenSlice";

export const store = configureStore({
  reducer: {
    subscriptionForm: subscriptionFormReducer,
    payment: paymentReducer,

    [boatsApi.reducerPath]: boatsApi.reducer,
    [carsApi.reducerPath]: carsApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [marketplaceApi.reducerPath]: marketplaceApi.reducer,
    [motorcyclesApi.reducerPath]: motorcyclesApi.reducer,
    [realEstateApi.reducerPath]: realEstateApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [tractorsApi.reducerPath]: tractorsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(boatsApi.middleware)
      .concat(carsApi.middleware)
      .concat(chatApi.middleware)
      .concat(marketplaceApi.middleware)
      .concat(motorcyclesApi.middleware)
      .concat(realEstateApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(tractorsApi.middleware)
      .concat(userApi.middleware)
      .concat(paymentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
