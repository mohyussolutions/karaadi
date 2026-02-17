import { Server, Socket } from "socket.io";
import chalk from "chalk";
import prisma from "src/core/utils/db.ts";

let io: Server;

export const socketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", async (socket: Socket) => {
    const userId = socket.handshake.auth.userId;

    console.log(
      chalk.yellow(
        `Socket connected: ${socket.id} user=${userId || "unknown"}`,
      ),
    );

    if (!userId) return;

    socket.join(`user_${userId}`);

    socket.on("disconnect", async () => {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { lastSeenAt: new Date() },
        });
      } catch {}

      console.log(chalk.red(`User ${userId} disconnected`));
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
