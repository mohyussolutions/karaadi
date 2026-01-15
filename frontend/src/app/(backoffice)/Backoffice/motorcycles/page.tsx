"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { loadBackofficeItems, deleteBackofficeItem } from "../lib/storage";

export default function MotorcyclesPage() {
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    setItems(loadBackofficeItems("motorcycles"));
  }, []);

  function handleDelete(id: string) {
    if (!confirm("Delete this motorcycle?")) return;
    deleteBackofficeItem("motorcycles", id);
    setItems(loadBackofficeItems("motorcycles"));
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Motorcycles</h2>
        <div className="flex gap-2">
          <Link href="/Backoffice/motorcycles/creating" className="px-3 py-2 bg-blue-600 text-white rounded">Create</Link>
          <Link href="/Backoffice" className="px-3 py-2 bg-gray-200 rounded">Back</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">No motorcycles yet.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="p-3 border rounded flex items-start justify-between">
              <div>
                <div className="font-semibold">{it.title || '(no title)'}</div>
                <div className="text-sm text-gray-600">{it.make} {it.modelName}</div>
                <div className="text-sm mt-2">Price: {it.price}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/Backoffice/motorcycles/edit?id=${it.id}`} className="px-2 py-1 bg-yellow-200 rounded">Edit</Link>
                <button onClick={() => handleDelete(it.id)} className="px-2 py-1 bg-red-200 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
