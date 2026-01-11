import { Server, Socket } from "socket.io";
import chalk from "chalk";
import { prisma } from "core/utils/db.ts";

export const subscriptionHandler = (
  io: Server,
  socket: Socket,
  userId: string
) => {
  socket.on(
    "subscribeToListings",
    (data: { category: string; subCategory?: string; city: string }) => {
      const { category, subCategory, city } = data;
      const room = subCategory
        ? `listings_${category}_${city}_${subCategory}`.toLowerCase()
        : `listings_${category}_${city}`.toLowerCase();

      socket.join(room);
      console.log(chalk.blue(`⚓ User ${userId} joined room: ${room}`));
    }
  );

  socket.on(
    "unsubscribeFromListings",
    (data: { category: string; subCategory?: string; city: string }) => {
      const { category, subCategory, city } = data;
      const room = subCategory
        ? `listings_${category}_${city}_${subCategory}`.toLowerCase()
        : `listings_${category}_${city}`.toLowerCase();

      socket.leave(room);
      console.log(chalk.yellow(`🚪 User ${userId} left room: ${room}`));
    }
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
      const { category, subCategory, city, title, budget } = data;
      const room = subCategory
        ? `listings_${category}_${city}_${subCategory}`.toLowerCase()
        : `listings_${category}_${city}`.toLowerCase();

      io.to(room).emit("userSearching", {
        userId,
        title,
        budget,
        timestamp: new Date(),
      });

      console.log(
        chalk.magenta(`🔍 User ${userId} is looking for "${title}" in ${room}`)
      );
    }
  );

  socket.on("syncMySubscriptions", async () => {
    try {
      const subs = await prisma.subscription.findMany({
        where: { userId, isActive: true },
      });

      subs.forEach((sub) => {
        const room = sub.subCategory
          ? `listings_${sub.category}_${sub.city}_${sub.subCategory}`.toLowerCase()
          : `listings_${sub.category}_${sub.city}`.toLowerCase();

        socket.join(room);
        console.log(chalk.cyan(`🔄 User ${userId} auto-joined: ${room}`));
      });
    } catch (error) {
      console.error(chalk.red("Error syncing subscriptions:"), error);
    }
  });
};
