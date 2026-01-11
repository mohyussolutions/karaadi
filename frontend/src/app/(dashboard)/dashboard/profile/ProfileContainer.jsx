"use client";

import React from "react";
import ProfileDetails from "./ProfileDetails";

export default function ProfileContainer() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "USER",
    joined: "2024-01-10",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff",
  };

  return (
    <div className="mx-auto p-4">
      <ProfileDetails user={user} />
    </div>
  );
}
