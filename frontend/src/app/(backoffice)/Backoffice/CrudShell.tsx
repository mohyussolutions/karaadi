"use client";

import Link from "next/link";
import React from "react";

interface Props {
  sectionId: string;
  title?: string;
}

export default function CrudShell({ sectionId, title }: Props) {
  const base = `/Backoffice/${sectionId}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title ?? sectionId}</h2>
        <div className="space-x-2">
          <Link href={`${base}/creating`} className="text-sm text-blue-600">Create</Link>
          <Link href={base} className="text-sm text-gray-600">List</Link>
        </div>
      </div>

      <div className="py-6 text-gray-500">This is a simple CRUD shell for the <strong>{sectionId}</strong> section.</div>
    </div>
  );
}
