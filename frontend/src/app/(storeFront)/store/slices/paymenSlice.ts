import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080/api";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type ListingType = "FEE" | "SUBSCRIPTION" | "BOOST";

export interface Payment {
  id: string;
  userId: string;
  carId?: string | null;
  realEstateId?: string | null;
  boatId?: string | null;
  motorcycleId?: string | null;
  traktorId?: string | null;
  marketplaceId?: string | null;
  subscriptionId?: string | null;
  listingType: ListingType;
  paymentMethod?: string | null;
  transactionId?: string | null;
  feeAmount: number;
  baseFee: number;
  taxAmount: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
}

export interface PaymentResponse {
  success: boolean;
  payment: Payment;
  transactionId: string;
}

export interface ProcessPaymentInput {
  method: string;
  account: string;
  amount: number;
  listingType: ListingType;
  carId?: string;
  realEstateId?: string;
  boatId?: string;
  motorcycleId?: string;
  traktorId?: string;
  marketplaceId?: string;
  subscriptionId?: string;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["Payment", "Listing"],
  endpoints: (builder) => ({
    processPayment: builder.mutation<PaymentResponse, ProcessPaymentInput>({
      query: (data) => ({
        url: "/payments/process",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Listing"],
    }),
  }),
});

interface PaymentState {
  draft: {
    method: string;
    account: string;
    amount: number;
    listingType: ListingType;
    activeItemId: string | null;
  };
  result: Payment | null;
}

const initialState: PaymentState = {
  draft: {
    method: "evc",
    account: "",
    amount: 0,
    listingType: "FEE",
    activeItemId: null,
  },
  result: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    updatePaymentDraft: (
      state,
      action: PayloadAction<Partial<PaymentState["draft"]>>
    ) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    setPaymentResult: (state, action: PayloadAction<Payment>) => {
      state.result = action.payload;
    },
    resetPayment: () => initialState,
  },
});

export const { updatePaymentDraft, setPaymentResult, resetPayment } =
  paymentSlice.actions;
export const { useProcessPaymentMutation } = paymentApi;
export const paymentReducer = paymentSlice.reducer;
