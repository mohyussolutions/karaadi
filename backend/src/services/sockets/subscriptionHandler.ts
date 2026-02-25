import { Server, Socket } from "socket.io";
import chalk from "chalk";
import prisma from "src/core/utils/db.ts";

const getRoomName = (
  category: string,
  city: string,
  subCategory?: string | null,
) => {
  return subCategory
    ? `listings_${category}_${city}_${subCategory}`.toLowerCase()
    : `listings_${category}_${city}`.toLowerCase();
};

export const subscriptionHandler = (
  io: Server,
  socket: Socket,
  userId: string,
) => {
  socket.on(
    "subscribeToListings",
    (data: { category: string; subCategory?: string; city: string }) => {
      const room = getRoomName(data.category, data.city, data.subCategory);
      socket.join(room);
      console.log(chalk.blue(`User ${userId} joined room: ${room}`));
    },
  );

  socket.on(
    "unsubscribeFromListings",
    (data: { category: string; subCategory?: string; city: string }) => {
      const room = getRoomName(data.category, data.city, data.subCategory);
      socket.leave(room);
      console.log(chalk.yellow(`User ${userId} left room: ${room}`));
    },
  );

  socket.on(
    "lookingForSomething",
    (data: {
      category: string;
      subCategory?: string;
      city: string;
      title: string;
      budget?: number;
    }) => {
      const room = getRoomName(data.category, data.city, data.subCategory);

      io.to(room).emit("userSearching", {
        userId,
        title: data.title,
        budget: data.budget,
        timestamp: new Date(),
      });

      console.log(
        chalk.magenta(
          `User ${userId} is looking for "${data.title}" in ${room}`,
        ),
      );
    },
  );

  socket.on("syncMySubscriptions", async () => {
    try {
      const subs = await prisma.subscription.findMany({
        where: { userId, isActive: true },
      });

      subs.forEach((sub: any) => {
        const room = getRoomName(sub.category, sub.city, sub.subCategory);
        socket.join(room);
        console.log(chalk.cyan(`User ${userId} auto-joined: ${room}`));
      });
    } catch (error) {
      console.error(chalk.red("Error syncing subscriptions:"), error);
    }
  });
};
