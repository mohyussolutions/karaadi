import { apiUrls } from "@/actions/constant/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrls.BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "/api/users/register",
        method: "POST",
        body,
      }),
    }),
    confirmUser: builder.mutation<
      { message: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: apiUrls.CONFIRM,
        method: "POST",
        body,
      }),
    }),
    resendCode: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: apiUrls.RESEND_CODE,
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/api/users/auth",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/api/users/profile",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useConfirmUserMutation,
  useGetProfileQuery,
  useResendCodeMutation,
} = userApi;

export default userApi;
