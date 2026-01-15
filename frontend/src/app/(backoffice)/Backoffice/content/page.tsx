"use client";

import React, { useState } from "react";

export default function ContentPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Content — Create / Edit</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ title, body });
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
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 h-40"
          />
        </div>

        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
