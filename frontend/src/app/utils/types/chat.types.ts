export interface ChatMessage {
  id: number
  chatId: number
  senderId: string
  senderName: string
  senderAvatar: string | null
  content: string
  timestamp: string
  createdAt: string
  read?: boolean
  deleted?: boolean
  isEdited?: boolean
  sender?: {
    id: string
    username: string
    profileImage: string | null
  }
}

export interface Chatroom {
  chatId: number
  senderId: string
  senderName: string
  senderAvatar: string | null
  receiverId: string
  receiverName: string
  receiverAvatar: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  unreadCount: number
  updatedAt: string
  itemTitle?: string | null
  itemImage?: string | null
  itemPrice?: number | null
}

export interface ChatState {
  chatId: number | null
  chatrooms: Chatroom[]
  messages: ChatMessage[]
  otherUserTyping: boolean
  open: boolean
  inboxLoading: boolean
  messagesLoading: boolean
}

export interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
}

export interface ConversationRowProps {
  chatroom: Chatroom
  isActive: boolean
  currentUserId: string
  onClick: (chatId: number) => void
}
