"use client";

import React, { useState } from "react";
import Link from "next/link";
import managementFolderLinks from "@/app/(links)/management/links/managementFolderLinks";
import { FaEllipsisH } from "react-icons/fa";
import { apiService } from "@/actions/core/authAction";

const ManagementContent = () => {
  const preferred = ["users", "listings", "content", "marketplace"];
  const links = managementFolderLinks.filter((l) => preferred.includes(l.id));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function quickRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      await apiService.register(username, email, password);
      alert("User created");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to register user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="bg-white rounded shadow-sm p-6">
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((l) => (
            <Link key={l.id} href={l.href} className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50 transition">
              <l.icon className="text-gray-600 w-6 h-6" />
              <div>
                <div className="font-medium text-gray-800">{l.name}</div>
                <div className="text-sm text-gray-500">{l.id}</div>
              </div>
            </Link>
          ))}

          <Link href="/managment/listings" className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50 transition">
            <FaEllipsisH className="text-gray-600 w-6 h-6" />
            <div>
              <div className="font-medium text-gray-800">More</div>
              <div className="text-sm text-gray-500">All sections</div>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default ManagementContent;
