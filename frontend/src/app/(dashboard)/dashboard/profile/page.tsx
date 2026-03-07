"use client";

import React from "react";
import Image from "next/image";

interface User {
  name: string;
  email: string;
  role: string;
  joined: string;
  avatar: string;
}

const user: User = {
  name: "John Doe",
  email: "john@example.com",
  role: "USER",
  joined: "2024-01-10",
  avatar:
    "https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff",
};

export default function Profile() {
  const { name, email, role, joined, avatar } = user;

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl p-8 border">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Image
          src={avatar}
          alt={name + "'s avatar"}
          width={110}
          height={110}
          className="rounded-full border shadow"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          <p className="text-gray-600 text-sm">{email}</p>

          <span className="mt-2 inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
            {role}
          </span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-gray-700 font-semibold">Account Status</h3>
          <p className="text-gray-600 mt-1">Active</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-gray-700 font-semibold">Member Since</h3>
          <p className="text-gray-600 mt-1">{joined}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-gray-700 font-semibold">Total Listings</h3>
          <p className="text-gray-600 mt-1">12</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-gray-700 font-semibold">Messages</h3>
          <p className="text-gray-600 mt-1">34 unread</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition duration-150">
          Edit My Profile
        </button>

        <button className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition duration-150">
          Delete My Account
        </button>
      </div>
    </div>
  );
}
