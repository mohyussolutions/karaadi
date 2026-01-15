"use client";

import React, { useState } from "react";

export default function ServicesPage() {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Services — Create / Edit</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ title, provider });
          alert("Saved (demo)");
        }}
        className="space-y-4 max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
