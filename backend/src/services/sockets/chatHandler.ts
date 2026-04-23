import { Server, Socket } from "socket.io";
import prisma from "../../core/utils/db.ts";

export const chatHandler = (io: Server, socket: Socket, userId: string) => {
  socket.on("joinChat", async (chatId: number) => {
    try {
      const numId = parseInt(chatId.toString(), 10);
      if (!numId) return;

      const chat = await prisma.chat.findUnique({
        where: { id: numId },
        select: { senderId: true, receiverId: true },
      });

      if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
        return socket.emit("chatError", { error: "Access denied" });
      }

      // Join immediately — don't wait for message history
      socket.join(`chat_${numId}`);
    } catch {
      socket.emit("chatError", { error: "Failed to join chat" });
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
