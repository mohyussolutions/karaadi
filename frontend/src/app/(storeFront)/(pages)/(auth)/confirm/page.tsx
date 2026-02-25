"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// FIX: userSlice import missing. Please create '@/app/(storeFront)/store/slices/userSlice.ts' or update import path to an existing slice (e.g., authSlice.tsx).
// import {
//   useConfirmUserMutation,
//   useResendCodeMutation,
// } from "@/app/(storeFront)/store/slices/userSlice";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const [confirmUser, { isLoading: isConfirmLoading }] =
    useConfirmUserMutation();
  const [resendCode, { isLoading: isResendLoading }] = useResendCodeMutation();

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await confirmUser({ email, code: code.trim() }).unwrap();
      toast.success(result.message || "Email confirmed successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err.error || "Failed to confirm email.",
      );
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      const result = await resendCode({ email: email.trim() }).unwrap();
      toast.success(result.message || "New code sent!");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 from-gray-50 via-white to-blue-200">
      <form
        onSubmit={handleConfirm}
        className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl flex flex-col"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900">
          Confirm Your Email
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600 font-semibold">
          Enter your email and confirmation code below
        </p>

        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        />

        <label
          htmlFor="code"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Confirmation Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Enter confirmation code"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        />

        <button
          type="submit"
          disabled={isConfirmLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl shadow-md transition ${
            isConfirmLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isConfirmLoading ? "Confirming..." : "Confirm Email"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-700 text-sm">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResendLoading}
              className="text-blue-600 hover:underline font-semibold focus:outline-none"
            >
              {isResendLoading ? "Sending..." : "Resend code"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ConfirmEmail;
