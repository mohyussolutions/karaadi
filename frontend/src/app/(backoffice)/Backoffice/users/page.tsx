"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/actions/core/authAction";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BackUser = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  isAdmin?: boolean;
  isManager?: boolean;
  isSupport?: boolean;
};

export default function UsersManagerPage() {
  const [users, setUsers] = useState<BackUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"manager" | "support" | "devices">("manager");

  async function load() {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      setUsers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await apiService.createUser(username, email, password);
      const updates: any = {};
      if (role === "manager") updates.isManager = true;
      if (role === "support") updates.isSupport = true;
      if (role === "devices") updates.isAdmin = false;
      if (Object.keys(updates).length) await apiService.updateUser(created._id || (created as any).id, updates);
      setUsername("");
      setEmail("");
      setPassword("");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  }

  async function handleConfirmEmail(u: BackUser) {
    const code = prompt("Enter confirmation code for " + u.email);
    if (!code) return;
    try {
      await apiService.confirmEmail(u.email, code);
      alert("Email confirmed");
      load();
    } catch (err) {
      console.error(err);
      alert("Confirm failed");
    }
  }

  async function handleMarkPhone(u: BackUser) {
    if (!confirm("Mark phone as confirmed for " + u.username + "?")) return;
    try {
      await apiService.updateUser(u._id, { phoneVerified: true });
      alert("Phone marked as confirmed");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to mark phone");
    }
  }

  async function handleTogglePhone(u: BackUser) {
    const newVal = !u.phoneVerified;
    if (!confirm(`${newVal ? "Mark" : "Unmark"} phone verification for ${u.username}?`)) return;
    try {
      await apiService.updateUser(u._id, { phoneVerified: newVal } as any);
      alert("Phone verification updated");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update phone verification");
    }
  }

  const managers = users.filter((u) => u.isManager);

  const pathname = usePathname();

  return (
    <div className="p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Manager users ({managers.length})</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-1">Username</th>
                <th className="px-2 py-1">Email</th>
                <th className="px-2 py-1">Phone</th>
                <th className="px-2 py-1">Phone Verified</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-2 py-2">{u.username}</td>
                  <td className="px-2 py-2">{u.email}</td>
                  <td className="px-2 py-2">{u.phone ?? "—"}</td>
                  <td className="px-2 py-2">{u.phoneVerified ? "Yes" : "No"}</td>
                  <td className="px-2 py-2 flex gap-2">
                    <button onClick={() => handleConfirmEmail(u)} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Confirm Email</button>
                    {u.phoneVerified ? (
                      <button onClick={() => handleTogglePhone(u)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Unmark Phone</button>
                    ) : (
                      <button onClick={() => handleTogglePhone(u)} className="px-2 py-1 bg-yellow-600 text-white rounded text-sm">Mark Phone</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
