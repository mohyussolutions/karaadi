// socketServer.ts
import { Server, Socket } from "socket.io";
import chalk from "chalk";

import { chatHandler } from "./chatHandler.ts";
import { messageHandler } from "./messageHandler.ts";
import { notificationHandler } from "./notificationHandler.ts";
import { subscriptionHandler } from "./subscriptionHandler.ts";
import prisma from "core/utils/db.ts";

let io: Server;

export const socketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        "http://localhost:8080",
      ].filter(Boolean) as string[],
      credentials: true,
    },
  });

  io.on("connection", async (socket: Socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    console.log(chalk.green(`✔ User ${userId} connected`));
    socket.join(`user_${userId}`);

    chatHandler(io, socket, userId);
    messageHandler(io, socket, userId);
    notificationHandler(io, socket, userId);
    subscriptionHandler(io, socket, userId);

    socket.on("disconnect", async () => {
      const userSockets = await io.in(`user_${userId}`).fetchSockets();
      if (userSockets.length === 0) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { lastSeenAt: new Date() },
          });
        } catch (e) {}
      }
      console.log(chalk.red(`✘ User ${userId} disconnected`));
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
