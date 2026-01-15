"use client";

import { useState } from "react";
import { apiService } from "@/actions/core/authAction";
import { useRouter } from "next/navigation";

export default function BackofficeForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.forgotPassword(email);
      alert("Reset initiated. Check email.");
      router.push("/Backoffice/users");
    } catch (err) {
      console.error(err);
      alert("Failed to initiate reset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgot} className="space-y-3">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Send Reset</button>
        </div>
      </form>
    </div>
  );
}
