export interface ChatSystemProps {
  currentUserId: string;
  selectedChat: any;
  messages: ChatMessage[];
  isConnected: boolean;
  isMobile: boolean;
  onSelectChat: (chat: any) => void;
  onSendMessage: (content: string) => void;
  onDeleteMessage: (id: string | number) => void;
  onEditMessage: (id: string | number, content: string) => void;
  onRetryFailedMessage: (msg: any) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  sellerId?: string;
  itemId?: string;
  initialChatId?: number;
  onChatChange?: (newChatId: number) => void;
  itemTitle?: string;
  initialMessage?: string;
}
export interface ChatMessage {
  id: string;
  tempId?: string | number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read?: boolean;
  createdAt?: string;
  status?: string;
}

export interface ChatMessagesDisplayProps {
  messages: ChatMessage[];
  currentUserId: string;
  selectedChat: any;
  isConnected: boolean;
  isMobile: boolean;
  onSelectChat: (chat: any) => void;
  onRetryFailedMessage: (msg: any) => void;
  onDeleteMessage: (id: string | number) => void;
  onEditMessage: (id: string | number, content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export interface Message extends ChatMessage {
  tempId?: string | number;
  createdAt?: string;
  status?: string;
  deleted?: boolean;
  isEdited?: boolean;
}
