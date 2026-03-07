import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import chalk from "chalk";
import prisma from "src/core/utils/db.ts";

let io: Server;

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

  io.on("connection", async (socket: Socket) => {
    const rawUserId = socket.handshake.auth.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (userId) {
      console.log(
        chalk.yellow(`Socket connected: ${socket.id} user=${userId}`),
      );
      socket.join(`user_${userId}`);
    }

    socket.on("disconnect", async () => {
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId as string },
            data: { lastSeenAt: new Date() },
          });
          console.log(chalk.red(`User ${userId} disconnected`));
        } catch (error) {
          console.error(chalk.red(`Status update failed for user: ${userId}`));
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
