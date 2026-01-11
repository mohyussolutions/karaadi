import { Server, Socket } from "socket.io";

export const notificationHandler = (
  io: Server,
  socket: Socket,
  userId: string
) => {
  socket.on(
    "subscribeToListings",
    (data: { category: string; subcategory?: string; city: string }) => {
      const room = data.subcategory
        ? `listings_${data.category}_${data.city}_${data.subcategory}`
        : `listings_${data.category}_${data.city}`;

      socket.join(room);
    }
  );

  socket.on(
    "unsubscribeFromListings",
    (data: { category: string; subcategory?: string; city: string }) => {
      const room = data.subcategory
        ? `listings_${data.category}_${data.city}_${data.subcategory}`
        : `listings_${data.category}_${data.city}`;

      socket.leave(room);
    }
  );

  socket.on(
    "subscribeNotification",
    (data: { category: string; subcategory: string }) => {
      socket.join(
        `notifications_${userId}_${data.category}_${data.subcategory}`
      );
    }
  );
};
