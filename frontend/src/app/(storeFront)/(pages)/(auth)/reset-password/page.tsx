"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import Link from "next/link";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { apiUrls } from "@/actions/constant/constant";

export default function ResetCode() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  if (!email) return null;

  const handleResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.trim() !== newPassword) {
      toast.error("Password cannot start or end with spaces.");
      return;
    }
    if (!resetCode) {
      toast.error("Reset code is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrls.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword: newPassword.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reset password.");
      }

      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch(apiUrls.RESEND_CODE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to resend code.");
      }

      const result = await res.json();
      toast.success(result.message || "New code sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleResetCode}
        className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl flex flex-col"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900">
          Reset Password
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600 font-semibold">
          Enter your new password
        </p>
        <p className="text-center text-sm mb-6 text-gray-700">
          Resetting password for: <span className="font-semibold">{email}</span>
        </p>

        <label
          htmlFor="resetCode"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Reset Code
        </label>
        <input
          id="resetCode"
          type="text"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
          required
          placeholder="Enter reset code"
        />

        <PasswordToggle
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <PasswordToggle
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="mb-8 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl shadow-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <Loading /> : "Reset Password"}
        </button>

        <p className="mt-8 text-center text-gray-700">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendLoading}
          className="text-blue-600 hover:underline font-semibold focus:outline-none mt-4"
        >
          {resendLoading ? "Sending..." : "Resend code"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
