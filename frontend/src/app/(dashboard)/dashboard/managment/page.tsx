"use client";

import Link from "next/link";
import React from "react";
import { managerTotalLinks } from "@/app/(links)/managmentLinks/managerLinks";

export default function ManagementIndex() {
  const inventory = managerTotalLinks.filter((l) => l.category === "inventory");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Management</h1>
      <p className="mb-4">Select a management section below.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {inventory.map((l) => (
          <Link key={l.href} href={l.href} className="p-4 border rounded hover:bg-gray-50">
            <div className="text-lg font-medium">{l.name}</div>
            <div className="text-sm text-gray-500">{l.href}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
