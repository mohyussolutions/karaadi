import { Server, Socket } from "socket.io";
import { EncryptionController } from "../../controllers/encryptionController/encryptionController.ts";
import prisma from "../../core/utils/db.ts";

export const chatHandler = (io: Server, socket: Socket, userId: string) => {
  socket.on("joinChat", async (chatId: number) => {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: parseInt(chatId.toString()) },
      });

      if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
        return socket.emit("chatError", {
          error: "Access denied",
        });
      }

      socket.join(`chat_${chatId}`);

      const messages = await prisma.message.findMany({
        where: { chatId: parseInt(chatId.toString()) },
        orderBy: { timestamp: "asc" },
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

      const decryptedMessages = messages.map((msg) => ({
        ...msg,
        content: EncryptionController.decrypt(msg.content),
      }));

      socket.emit("chatHistory", {
        messages: decryptedMessages,
        chatInfo: chat,
      });
    } catch (error) {
      socket.emit("chatError", {
        error: "Failed to load chat history",
      });
    }
  });

  socket.on("leaveChat", (chatId: number) => {
    socket.leave(`chat_${chatId}`);
  });

  socket.on("typing", (data: { chatId: number; isTyping: boolean }) => {
    socket.to(`chat_${data.chatId}`).emit("userTyping", {
      userId,
      chatId: data.chatId,
      isTyping: data.isTyping,
    });
  });
};
