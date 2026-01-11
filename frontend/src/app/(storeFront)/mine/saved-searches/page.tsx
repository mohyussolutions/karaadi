"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../../components/shared/Loading/Loading";
import { getProfile, deleteAccount } from "@/actions/core/accountAction";
import { apiService } from "@/actions/core/authAction";
import {
  FiSmartphone,
  FiMonitor,
  FiTablet,
  FiCheckCircle,
  FiHeart,
  FiList,
  FiSearch,
  FiSettings,
  FiClock,
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { navLinks } from "@/app/(links)/storeFrontLinks/mineLinks";

interface IDevice {
  name: string;
  type: "phone" | "laptop" | "tablet" | "samsung" | "iphone";
  lastActive: string;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  devices?: IDevice[];
}

interface INavLink {
  name: string;
  href: string;
  icon: JSX.Element;
  color?: string;
}

const Account: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profile, session] = await Promise.all([
          getProfile(accessToken),
          apiService.verifySession(),
        ]);
        setUser({ ...profile, ...session });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "iphone":
      case "samsung":
      case "phone":
        return <FiSmartphone className="text-blue-500" />;
      case "ipad":
      case "tablet":
        return <FiTablet className="text-purple-500" />;
      default:
        return <FiMonitor className="text-gray-500" />;
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "delete me") return;

    setIsDeleting(true);
    try {
      await deleteAccount(accessToken);
      window.location.href = "/";
    } catch (error) {
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10 pb-10 px-4">
      <div className="max-w-5xl mx-auto w-full flex-grow space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FiUser size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Current User
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.username}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-0 md:pl-6">
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <FiMail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Email Address
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.email}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl transition-all hover:shadow-md hover:border-blue-100 group"
            >
              <span
                className={`text-xl mb-1 ${
                  link.color || "text-gray-500"
                } group-hover:scale-110 transition-transform`}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600 text-center">
                {link.name}
              </span>
            </Link>
          ))}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl transition-all hover:shadow-md hover:border-red-100 group"
          >
            <FiTrash2 className="text-xl mb-1 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 text-center">
              Delete
            </span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100 mr-6">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {user?.username}
                </h2>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md inline-flex items-center gap-1 border border-emerald-100">
                    <FiCheckCircle /> Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-[9px] font-black text-gray-400 uppercase block">
                  Phone
                </label>
                <p className="text-xs font-bold text-gray-800">
                  {user?.phone || "Not Verified"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-[9px] font-black text-gray-400 uppercase block">
                  Member ID
                </label>
                <p className="text-[10px] font-mono text-gray-600 truncate">
                  {user?._id}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
              Security & Active Devices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.devices?.map((device, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800 uppercase">
                      {device.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Active: {device.lastActive}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-red-50 flex items-center justify-between border-b border-red-100">
              <div className="flex items-center gap-3 text-red-600">
                <FiAlertTriangle size={24} />
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Final Warning
                </h3>
              </div>
              {!isDeleting && (
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConfirmText("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mb-2">
                  Account to delete
                </p>
                <p className="text-sm font-black text-gray-900 text-center">
                  {user?.email}
                </p>
                <p className="text-[10px] font-mono text-gray-400 text-center break-all">
                  {user?._id}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-600 text-center">
                  To confirm, please type{" "}
                  <span className="text-red-600 font-black">"delete me"</span>{" "}
                  below:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  disabled={isDeleting}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete me"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center font-bold focus:border-red-200 outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  disabled={confirmText !== "delete me" || isDeleting}
                  className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center"
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? "Deleting..." : "Confirm Permanent Deletion"}
                </button>
                {!isDeleting && (
                  <button
                    className="w-full py-4 bg-gray-100 text-gray-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setConfirmText("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
