import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import chalk from "chalk";
import prisma from "src/core/utils/db.ts";
import { chatHandler } from "./chatHandler.ts";
import { messageHandler } from "./messageHandler.ts";

let io: Server;

const disconnectTimers = new Map<string, ReturnType<typeof setTimeout>>();

const scheduleLastSeen = (userId: string) => {
  const existing = disconnectTimers.get(userId);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    disconnectTimers.delete(userId);
    prisma.user
      .update({ where: { id: userId }, data: { lastSeenAt: new Date() } })
      .catch(() => {});
  }, 5000);
  disconnectTimers.set(userId, timer);
};

export const socketServer = (server: any, pubClient?: any, subClient?: any) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  if (pubClient && subClient) {
    io.adapter(createAdapter(pubClient, subClient));
    console.log(chalk.blue("Socket.io Redis Adapter initialized"));
  }

  io.on("connection", (socket: Socket) => {
    const rawUserId = socket.handshake.auth.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (userId) {
      socket.join(`user_${userId}`);
      chatHandler(io, socket, userId as string);
      messageHandler(io, socket, userId as string);
    }

    socket.on("disconnect", () => {
      if (userId) scheduleLastSeen(userId as string);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
