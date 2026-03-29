"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validateEmail } from "@/app/(storeFront)/components/hooks/useValidateEmail";
import { apiUrls } from "@/actions/constant/constant";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrls.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send reset link.");
      }

      toast.success("Reset code sent! Check your email.");

      setTimeout(
        () => router.push(`/reset-password?email=${encodeURIComponent(email)}`),
        1500,
      );
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleForgotPassword}
        className="bg-[#FEFDFD] shadow-xl rounded-2xl p-8 w-full max-w-md
          ring-1 ring-gray-200
          transition-transform transform hover:scale-[1.02] duration-300"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Forgot Password
        </h2>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-2 text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-indigo-300
              focus:border-indigo-500
              transition"
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
            text-white font-semibold py-3 rounded-xl shadow-md
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
