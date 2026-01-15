"use client";

import { useState } from "react";
import { apiService } from "@/actions/core/authAction";
import { useRouter } from "next/navigation";

export default function BackofficeUserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await apiService.login(email, password);
      alert("Logged in");
      // redirect depending on role
      if (user.isAdmin) router.push("/dashboard");
      else if (user.isManager) router.push("/Backoffice");
      else router.push("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded" />
        <div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Logging…" : "Login"}</button>
        </div>
      </form>
    </div>
  );
}
