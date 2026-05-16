"use client";

import { useEffect } from "react";
import { logout } from "@/actions/core/authAction";

export default function LogoutPage() {
  useEffect(() => {
    logout().then(() => {
      window.location.replace("/marketplace");
    });
  }, []);

  return null;
}
