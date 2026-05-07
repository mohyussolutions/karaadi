"use client";

import dynamic from "next/dynamic";

const DashboardHome = dynamic(() => import("./DashboardHome"), { ssr: false });

export default function DashboardPage() {
  return <DashboardHome />;
}
