"use client";

import React, { useState } from "react";

export default function TractorsCreate() {
  const [title, setTitle] = useState("");
  const [power, setPower] = useState("");

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Create Tractor</h2>
      <form className="space-y-4 max-w-xl" onSubmit={(e) => { e.preventDefault(); alert('Tractor saved (demo)'); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Power</label>
          <input value={power} onChange={(e) => setPower(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
