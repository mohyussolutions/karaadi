"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrls } from "@/actions/constant/constant";
import { inputCls } from "@/app/utils/style/main.style";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmLoading(true);
    try {
      const res = await fetch(apiUrls.CONFIRM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: code.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || err?.message || "Failed to confirm email.");
      }
      const data = await res.json();
      toast.success(data.message || "Email confirmed successfully!");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to confirm email.");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) { toast.error("Please enter your email first."); return; }
    setIsResendLoading(true);
    try {
      const res = await fetch(apiUrls.RESEND_CODE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || err?.message || "Failed to resend code.");
      }
      const data = await res.json();
      toast.success(data.message || "New code sent!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <form onSubmit={handleConfirm} className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl flex flex-col">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900">Confirm Your Email</h1>
        <p className="text-center text-lg mb-8 text-gray-600 font-semibold">
          Enter your email and confirmation code below
        </p>

        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className={inputCls}
        />

        <label htmlFor="code" className="block text-sm font-medium mb-1 text-gray-700">Confirmation Code</label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Enter confirmation code"
          className={inputCls}
        />

        <button
          type="submit"
          disabled={isConfirmLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-blue-600 hover:underline font-semibold focus:outline-none disabled:opacity-50"
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
