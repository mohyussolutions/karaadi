import { Server, Socket } from "socket.io";

import prisma from "../../core/utils/db.ts";
import { EncryptionController } from "src/controllers/encryptionController.ts";

export const messageHandler = (io: Server, socket: Socket, userId: string) => {
  const processedMessageIds = new Set<string>();

  socket.on("sendMessage", async (data: any) => {
    try {
      const { chatId, content, imageUrl, tempId } = data;

      if (!chatId || !content) {
        return socket.emit("sendMessageError", {
          error: "Chat ID and content are required",
          tempId,
        });
      }

      const chat = await prisma.chat.findUnique({
        where: { id: parseInt(chatId.toString()) },
        include: { sender: true, receiver: true },
      });

      if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
        return socket.emit("sendMessageError", {
          error: "Access denied",
          tempId,
        });
      }

      const receiverId =
        chat.senderId === userId ? chat.receiverId : chat.senderId;

      const encryptedContent = EncryptionController.encrypt(content);

      const message = await prisma.message.create({
        data: {
          chatId: parseInt(chatId.toString()),
          senderId: userId,
          receiverId,
          content: encryptedContent,
          imageUrl: imageUrl || null,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
        },
      });

      const decryptedMessage = {
        ...message,
        content: EncryptionController.decrypt(message.content),
      };

      await prisma.chat.update({
        where: { id: parseInt(chatId.toString()) },
        data: {
          updatedAt: new Date(),
          lastMessageAt: new Date(),
        },
      });

      const messageKey = `${message.id}-${chatId}`;
      processedMessageIds.add(messageKey);

      io.to(`chat_${chatId}`).emit("receiveMessage", decryptedMessage);
      io.to(`user_${receiverId}`).emit("newMessage", {
        chatId,
        message: decryptedMessage,
      });

      const unreadCount = await prisma.message.count({
        where: {
          receiverId,
          read: false,
        },
      });

      io.to(`user_${receiverId}`).emit("unreadCountUpdate", {
        count: unreadCount,
      });

      socket.emit("messageSent", {
        success: true,
        messageId: message.id,
        tempId,
        message: decryptedMessage,
      });

      setTimeout(() => {
        processedMessageIds.delete(messageKey);
      }, 5000);
    } catch (error) {
      socket.emit("sendMessageError", {
        error: "Failed to send message",
        tempId: data.tempId,
      });
    }
  });

  socket.on("markAsRead", async (data: { chatId: number }) => {
    try {
      const chatId = parseInt(data.chatId.toString());
      await prisma.message.updateMany({
        where: { chatId, receiverId: userId, read: false },
        data: { read: true, readAt: new Date() },
      });

      const unreadCount = await prisma.message.count({
        where: { receiverId: userId, read: false },
      });

      io.to(`chat_${chatId}`).emit("messagesMarkedAsRead", { chatId, userId });
      io.to(`user_${userId}`).emit("unreadCountUpdate", { count: unreadCount });
    } catch (error) {}
  });

  socket.on("typing", (data: { chatId: number; isTyping: boolean }) => {
    socket.to(`chat_${data.chatId}`).emit("userTyping", {
      userId,
      chatId: data.chatId,
      isTyping: data.isTyping,
    });
  });
};
