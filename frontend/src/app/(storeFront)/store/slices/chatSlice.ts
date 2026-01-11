import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api",
  }),
  endpoints: (builder) => ({
    getChatBetweenUsers: builder.query({
      query: ({ userId1, userId2, adId }) =>
        `chat/between/${userId1}/${userId2}/${adId}`,
    }),
    getUserChats: builder.query({
      query: (userId) => `chat/user/${userId}`,
    }),
    createChat: builder.mutation({
      query: (body) => ({ url: "chat", method: "POST", body }),
    }),
    getMessages: builder.query({
      query: (chatId) => `message/${chatId}`,
    }),
    sendMessageRest: builder.mutation({
      query: (body) => ({ url: "message", method: "POST", body }),
    }),
  }),
});

export const {
  useGetChatBetweenUsersQuery,
  useGetUserChatsQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useSendMessageRestMutation,
} = chatApi;
