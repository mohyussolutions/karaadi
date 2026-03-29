"use client";
import ManagerRoute from "@/app/Guard/ManagerRoute";
export default function ManagerRootGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagerRoute>{children}</ManagerRoute>;
}
