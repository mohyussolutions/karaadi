"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SupportSectionPage() {
  const params = useParams() as { section?: string };
  const section = params?.section || "unknown";
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const data = JSON.parse(localStorage.getItem(`support:${section}`) || "[]");
      setItems(data);
    } catch (e) {
      setItems([]);
    }
  }, [section]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support: {section}</h1>
        <Link href={`/support/${section}/create`} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Create
        </Link>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="text-gray-500">No items yet for {section}.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((it: any) => (
              <li key={it.id} className="p-3 border rounded-md bg-white">{it.title || JSON.stringify(it)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
