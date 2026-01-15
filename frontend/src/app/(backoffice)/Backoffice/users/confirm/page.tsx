"use client";

import { useState } from "react";
import { apiService } from "@/actions/core/authAction";
import { useRouter } from "next/navigation";

export default function BackofficeUserConfirm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.confirmEmail(email, code);
      alert("Confirmed");
      router.push("/Backoffice/users");
    } catch (err) {
      console.error(err);
      alert("Confirm failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Confirm Email</h2>
      <form onSubmit={handleConfirm} className="space-y-3">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Confirmation code" className="w-full px-3 py-2 border rounded" />
        <div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
        </div>
      </form>
    </div>
  );
}
