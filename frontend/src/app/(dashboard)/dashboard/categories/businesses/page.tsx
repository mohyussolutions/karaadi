"use client";

import dynamic from "next/dynamic";

const AdminBusinessesContent = dynamic(
  () => import("./AdminBusinessesContent"),
  { ssr: false },
);

export default AdminBusinessesContent;
