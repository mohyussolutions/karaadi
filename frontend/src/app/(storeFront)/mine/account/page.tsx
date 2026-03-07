"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "@/actions/core/accountAction";
import { verifySession } from "@/actions/core/authAction";
import Loading from "../../components/shared/Loading/Loading";
import Image from "next/image";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const session = await verifySession();
        if (!session) {
          setAccessToken("");
          setUser(null);
          router.push("/login");
          return;
        }
        setUser(session);
        setPreviewUrl(session.profileImage || null);
        const token = session.accessToken || session.token || "";
        setAccessToken(token);
        if (token) {
          const data = await getProfile(token);
          if (!data.error) {
            setUser(data);
            setPreviewUrl(data.profileImage || null);
          }
        }
      } catch (error) {
        setAccessToken("");
        setUser(null);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      alert("Session expired. Please log in again.");
      setUser(null);
      setAccessToken("");
      router.push("/login");
      return;
    }
    setUpdating(true);
    const formData = new FormData();
    const username = (e.currentTarget.username as HTMLInputElement).value;
    const phone = (e.currentTarget.phone as HTMLInputElement).value;
    if (username) formData.append("username", username);
    if (phone) formData.append("phone", phone);
    if (selectedFile) formData.append("profileImage", selectedFile);
    const result = await updateProfile(formData, accessToken);
    if (result.success) {
      alert("Profile updated successfully!");
      setUser(result.data?.user || result.data);
      setSelectedFile(null);
    } else {
      if (result.error && result.error.toLowerCase().includes("401")) {
        alert("Session expired. Please log in again.");
        setUser(null);
        setAccessToken("");
        router.push("/login");
      } else {
        alert(result.error || "Update failed");
      }
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!accessToken) {
      alert("Session expired. Please log in again.");
      setUser(null);
      setAccessToken("");
      router.push("/login");
      return;
    }
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    const result = await deleteAccount(accessToken);
    if (result.success) {
      setUser(null);
      setAccessToken("");
      router.push("/login");
    } else {
      if (result.error && result.error.toLowerCase().includes("401")) {
        alert("Session expired. Please log in again.");
        setUser(null);
        setAccessToken("");
        router.push("/login");
      } else {
        alert("Failed to delete account");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100 shadow-sm">
                <span className="text-3xl text-gray-400">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 file:cursor-pointer cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            className="w-full p-2 border rounded mt-1 bg-gray-100 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            defaultValue={user?.username}
            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={user?.phone || ""}
            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {updating ? "Saving..." : "Update Profile"}
        </button>
      </form>
      <div className="mt-12 pt-6 border-t border-red-100">
        <h2 className="text-red-600 font-bold text-lg">Danger Zone</h2>
        <button
          onClick={handleDelete}
          className="mt-2 text-red-500 hover:text-red-700 hover:underline text-sm font-medium"
        >
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}
