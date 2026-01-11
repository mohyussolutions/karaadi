import { BASE_API_URL } from "./BASE_API_URL";

export const SOCKET_URL = BASE_API_URL;

export const SOCKET_EVENTS = {
  EMIT: {
    JOIN_CHAT: "joinChat",
    LEAVE_CHAT: "leaveChat",
    SEND_MESSAGE: "sendMessage",
    TYPING: "typing",
    MARK_AS_READ: "markAsRead",
    MARK_MULTIPLE_AS_READ: "markMultipleAsRead",
    GET_ONLINE_STATUS: "getOnlineStatus",
    SUBSCRIBE_NOTIFICATION: "subscribeNotification",
    UNSUBSCRIBE_NOTIFICATION: "unsubscribeNotification",
  },
  ON: {
    CHAT_HISTORY: "chatHistory",
    RECEIVE_MESSAGE: "receiveMessage",
    NEW_MESSAGE: "newMessage",
    MESSAGE_SENT: "messageSent",
    USER_TYPING: "userTyping",
    MESSAGE_READ: "messageRead",
    MESSAGES_READ: "messagesRead",
    MESSAGES_MARKED_AS_READ: "messagesMarkedAsRead",
    ONLINE_STATUS: "onlineStatus",
    UNREAD_COUNT_UPDATE: "unreadCountUpdate",
    SEND_MESSAGE_ERROR: "sendMessageError",
    CHAT_ERROR: "chatError",
    ERROR: "error",
    MESSAGE_DELETED: "messageDeleted",
    MESSAGE_UPDATED: "messageUpdated",
  },
};
