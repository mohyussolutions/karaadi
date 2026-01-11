import { BASE_API_URL } from "./BASE_API_URL";

export const CHATS = {
  CREATE: `${BASE_API_URL}/api/chats/create`,
  USER_CHATS: (userId: string) => `${BASE_API_URL}/api/chats/user/${userId}`,
  CHAT_BY_ID: (chatId: number, userId: string) =>
    `${BASE_API_URL}/api/chats/${chatId}?userId=${userId}`,
  CHAT_MESSAGES: (chatId: number, userId: string) =>
    `${BASE_API_URL}/api/chats/${chatId}/messages?userId=${userId}`,
  DELETE: (chatId: number, userId: string) =>
    `${BASE_API_URL}/api/chats/${chatId}?userId=${userId}`,
  FIND_CONVERSATION: (
    userId: string,
    otherUserId: string,
    itemId: string,
    itemModel: string
  ) =>
    `${BASE_API_URL}/api/chats/conversation/find?userId=${userId}&otherUserId=${otherUserId}&itemId=${itemId}&itemModel=${itemModel}`,
  UPDATE_CHAT: (chatId: number) => `${BASE_API_URL}/api/chats/${chatId}`,
  ARCHIVED_CHATS: (userId: string) =>
    `${BASE_API_URL}/api/chats/user/${userId}/archived`,
  ADMIN_ALL: `${BASE_API_URL}/api/chats/admin/all`,
};

export const MESSAGES = {
  SEND: `${BASE_API_URL}/api/messages/send`,
  DELETE_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}/api/messages/${messageId}`,
  UPDATE_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}/api/messages/${messageId}`,
  UNREAD_COUNT: (userId: string) =>
    `${BASE_API_URL}/api/messages/unread/${userId}`,
  MARK_READ_ALL: (chatId: number) =>
    `${BASE_API_URL}/api/messages/${chatId}/read-all`,
  REPLY_TO_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}/api/messages/${messageId}/reply`,
  GET_MESSAGE_REPLIES: (messageId: number, userId: string) =>
    `${BASE_API_URL}/api/messages/${messageId}/replies?userId=${userId}`,
};

export const USERS_COMM = {
  VERIFY_SESSION: `${BASE_API_URL}/api/users/verify-session`,
  PROFILE: (userId: string) => `${BASE_API_URL}/api/users/${userId}`,
  UPDATE_PROFILE: (userId: string) => `${BASE_API_URL}/api/users/${userId}`,
  SEARCH: (query: string) => `${BASE_API_URL}/api/users/search?q=${query}`,
};

export const CONTACT = {
  STATS: `${BASE_API_URL}/api/contactUs/stats`,
  CREATE_TICKET: `${BASE_API_URL}/api/contact/tickets`,
  GET_TICKETS: `${BASE_API_URL}/api/contact/tickets`,
  UPDATE_TICKET: (ticketId: string) =>
    `${BASE_API_URL}/api/contact/tickets/${ticketId}`,
};

export const VISITORS = {
  TRACK_USER: `${BASE_API_URL}/api/visitors/track-user`,
  ANALYTICS: `${BASE_API_URL}/api/visitors/analytics`,
};

export const SUBSCRIPTION_ENDPOINTS = {
  SUBSCRIPTION_BASE: `${BASE_API_URL}/api/Subscription`,
  CREATE_SUBSCRIPTION: `${BASE_API_URL}/api/Subscription`,
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    `${BASE_API_URL}/api/Subscription/${userId}`,
  DELETE_SUBSCRIPTION: (id: string) => `${BASE_API_URL}/api/Subscription/${id}`,
  TRIGGER_NOTIFICATION: `${BASE_API_URL}/api/Subscription/notify`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS_BY_USER: (userId: string) =>
    `${BASE_API_URL}/api/notifications/user/${userId}`,
  MARK_NOTIFICATION_READ: (id: string) =>
    `${BASE_API_URL}/api/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: (userId: string) =>
    `${BASE_API_URL}/api/notifications/user/${userId}/read-all`,
  DELETE_NOTIFICATION: (id: string) =>
    `${BASE_API_URL}/api/notifications/${id}`,
  CLEAR_ALL_NOTIFICATIONS: (userId: string) =>
    `${BASE_API_URL}/api/notification/${userId}/clear-all`,
  GET_NOTIFICATION_STATS: (userId: string) =>
    `${BASE_API_URL}/api/notification/${userId}/stats`,
};
export const API_ENDPOINTS = {
  CHATS,
  MESSAGES,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  USERS: USERS_COMM,
  CONTACT,
  VISITORS,
  SUBSCRIPTION: SUBSCRIPTION_ENDPOINTS,
};
