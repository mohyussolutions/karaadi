"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRegister } from "./useRegister";
import { inputCls } from "@/app/utils/style/main.style";

function RegisterUser() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    ruleResults,
    isPasswordValid,
    showRules,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full px-10 py-8 rounded-3xl border border-gray-100 flex flex-col"
      >
        <h1 className="text-3xl font-extrabold mb-1 text-center text-gray-900">
          Create Account
        </h1>
        <p className="text-center text-base mb-6 text-gray-600">Register</p>

        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Choose a username"
          className={inputCls}
        />

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className={inputCls}
        />

        <PasswordToggle
          id="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="e.g. Password123@"
          className={`w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border outline-none focus:ring-2 transition text-gray-900 placeholder:text-gray-400 ${
            showRules && !isPasswordValid
              ? "border-red-400 focus:ring-red-300"
              : showRules && isPasswordValid
                ? "border-green-400 focus:ring-green-300"
                : "border-gray-300 focus:ring-blue-500"
          }`}
        />

        {showRules && (
          <ul className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            {ruleResults.map((rule) => (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${rule.passes ? "text-green-600" : "text-red-500"}`}
              >
                {rule.passes ? (
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <XCircle className="w-3 h-3 flex-shrink-0" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={isLoading || (showRules && !isPasswordValid)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-3xl flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Register"
          )}
        </button>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <p className="mt-5 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterUser;
