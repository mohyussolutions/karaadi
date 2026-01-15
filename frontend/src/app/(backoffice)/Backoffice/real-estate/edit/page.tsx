"use client";

import React, { useState } from "react";

export default function RealEstateEdit() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Edit Real Estate (demo)</h2>
      <form className="space-y-4 max-w-xl" onSubmit={(e) => { e.preventDefault(); alert('Real estate updated (demo)'); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
        </div>
      </form>
    </div>
  );
}
