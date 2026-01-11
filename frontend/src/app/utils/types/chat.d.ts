export interface ChatSystemProps {
  currentUserId: string;
  initialChatId?: number;
  sellerId?: string;
  itemId?: string;
  itemTitle?: string;
  initialMessage?: string;
  onChatChange?: (chatId: number) => void;
  onNotification?: (data: {
    chatId: number;
    sender: string;
    content: string;
  }) => void;
}

export interface User {
  id: string;
  username: string;
  profileImage?: string;
}

export interface Chat {
  id: number;
  item: {
    id: string | number;
    title: string;
    image?: string;
    price?: number;
    type?: string;
  };
  otherUser: User;
  lastMessage?: string;
  unreadCount?: number;
}

export interface Message {
  id?: number;
  tempId?: string;
  chatId: number;
  senderId: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
  status?: "sending" | "sent" | "failed";
  isEdited?: boolean;
  deleted?: boolean;
}

export interface ChatMessagesDisplayProps {
  currentUserId: string;
  selectedChat: Chat | null;
  messages: Message[];
  isConnected: boolean;
  isMobile: boolean;
  onSelectChat: (chat: Chat | null) => void;
  onRetryFailedMessage: (tempMessage: Message) => Promise<void>;
  onDeleteMessage: (messageId: number | string) => Promise<void>;
  onEditMessage: (
    messageId: number | string,
    newContent: string
  ) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
