"use client";

import { useEffect } from "react";
import { logout } from "@/actions/core/authAction";
import { socketService } from "@/actions/sockets/socketServiceAction";

export default function LogoutPage() {
  useEffect(() => {
    socketService.disconnect();
    logout().then(() => {
      window.location.replace("/marketplace");
    });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}
