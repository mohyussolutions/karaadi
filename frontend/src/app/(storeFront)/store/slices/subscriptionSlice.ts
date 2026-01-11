import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080";
const SUBSCRIPTION_URL = "/api/subscriptions";
const PAYMENT_URL = "/api/payments";

const SUBSCRIPTION_STATUS = ["active", "inactive", "pending"] as const;
const PAYMENT_STATUS = ["pending", "completed", "failed", "cancelled"] as const;
const PAYMENT_METHODS = ["waafi", "evc", "sahal"] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type SubscriptionUser = {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
  email?: string;
};

export type SearchCriteria = {
  mainCategory: string;
  category: string;
  subCategory: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  brand?: string;
  model?: string;
  specificFeatures?: string;
};

export type SubscriptionItem = {
  _id: string;
  id: string;
  user: string | SubscriptionUser;
  userId: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  duration?: string;
  locationId?: string;
  cityId?: string;
  regionId?: string;
  cityName?: string;
  regionName?: string;
  features?: string[];
  searchCriteria: SearchCriteria;
  status: SubscriptionStatus;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentData = {
  _id?: string;
  paymentId: string;
  subscriptionId: string;
  userId: string;
  method: PaymentMethod;
  account: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubscriptionInput = {
  userId: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  duration?: string;
  cityId?: string;
  regionId?: string;
  features?: string[];
  searchCriteria: Omit<SearchCriteria, "priceMin" | "priceMax"> & {
    priceMin?: string;
    priceMax?: string;
  };
};

export type UpdateSubscriptionInput = Partial<CreateSubscriptionInput> & {
  id: string;
};

export type CreatePaymentInput = {
  userId: string;
  subscriptionId: string;
  method: PaymentMethod;
  account: string;
  amount: number;
};

export type PaymentResponse = {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentId?: string;
  error?: string;
  data?: PaymentData;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const transformSubscriptionItem = (item: any): SubscriptionItem => ({
  ...item,
  id: item._id || item.id,
  price: Number(item.price) || 0,
});

const transformPaymentData = (item: any): PaymentData => ({
  ...item,
  id: item._id || item.id,
  amount: Number(item.amount) || 0,
});

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery,
  tagTypes: ["Subscription", "Payment"],
  endpoints: (builder) => ({
    getSubscriptions: builder.query<SubscriptionItem[], void>({
      query: () => SUBSCRIPTION_URL,
      transformResponse: (response: any[]) =>
        response.map(transformSubscriptionItem),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Subscription" as const,
                _id,
              })),
              "Subscription",
            ]
          : ["Subscription"],
    }),

    getSubscriptionById: builder.query<SubscriptionItem, string>({
      query: (id) => `${SUBSCRIPTION_URL}/${id}`,
      transformResponse: transformSubscriptionItem,
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),

    getUserSubscriptions: builder.query<SubscriptionItem[], void>({
      query: () => `${SUBSCRIPTION_URL}/user`,
      transformResponse: (response: any[]) =>
        response.map(transformSubscriptionItem),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Subscription" as const,
                _id,
              })),
              "Subscription",
            ]
          : ["Subscription"],
    }),

    createSubscription: builder.mutation<
      SubscriptionItem,
      CreateSubscriptionInput
    >({
      query: (data) => ({
        url: SUBSCRIPTION_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscription: builder.mutation<
      SubscriptionItem,
      UpdateSubscriptionInput
    >({
      query: ({ id, ...data }) => ({
        url: `${SUBSCRIPTION_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscription", id },
      ],
    }),

    deleteSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `${SUBSCRIPTION_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    getPaymentById: builder.query<PaymentData, string>({
      query: (id) => `${PAYMENT_URL}/subscription/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    getPaymentStatus: builder.query<PaymentResponse, string>({
      query: (paymentId) => `${PAYMENT_URL}/status/${paymentId}`,
      providesTags: (result, error, paymentId) => [
        { type: "Payment", paymentId },
      ],
    }),

    getSubscriptionPayments: builder.query<PaymentData[], string>({
      query: (subscriptionId) =>
        `${PAYMENT_URL}/subscription/${subscriptionId}/payments`,
      transformResponse: (response: any[]) =>
        response.map(transformPaymentData),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Payment" as const,
                _id,
              })),
              "Payment",
            ]
          : ["Payment"],
    }),

    processPayment: builder.mutation<PaymentResponse, CreatePaymentInput>({
      query: (args) => ({
        url: PAYMENT_URL,
        method: "POST",
        body: {
          payment: {
            userId: args.userId,
            itemCategory: "SUBSCRIPTION",
            itemId: args.subscriptionId,
            paymentMethod: args.method.toUpperCase(),
            accountNo: args.account,
            feeAmount: args.amount,
            listingType: "FEE",
            description: "Subscription Activation",
            currency: "USD",
          },
        },
      }),
      invalidatesTags: ["Payment", "Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useGetUserSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetPaymentByIdQuery,
  useGetPaymentStatusQuery,
  useGetSubscriptionPaymentsQuery,
  useProcessPaymentMutation,
} = subscriptionApi;
