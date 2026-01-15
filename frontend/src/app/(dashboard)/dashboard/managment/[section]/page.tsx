"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params: { section: string };
};

export default function ManagementSection({ params }: Props) {
  const { section } = params;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Management: {section}</h1>
      <p className="mb-4">This is a placeholder page for the <strong>{section}</strong> management section.</p>
      <p className="text-sm text-gray-600">Create, list and edit pages should be implemented here or linked from the Backoffice.</p>
    </div>
  );
}
