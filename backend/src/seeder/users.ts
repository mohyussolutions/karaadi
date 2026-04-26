import { USER_A, USER_B } from "./seederConstants.ts";

export const userItems = [
  {
    id: USER_A,
    username: "john_doe",
    password: "password123",
    email: "john@example.com",
    profileImage: "/assets/users/user1.jpg",
    phone: "+1234567890",
    isAdmin: false,
    isManager: false,
    lastSeenAt: new Date("2025-12-13T12:00:00Z"),
  },
  {
    id: USER_B,
    username: "jane_doe",
    password: "password123",
    email: "jane@example.com",
    profileImage: "/assets/users/user2.jpg",
    phone: "+1234567891",
    isAdmin: false,
    isManager: false,
    lastSeenAt: new Date("2025-12-13T12:05:00Z"),
  },
];
