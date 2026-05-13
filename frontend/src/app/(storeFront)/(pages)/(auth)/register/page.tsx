"use client";
export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { useRouter } from "next/navigation";
import { register } from "@/actions/core/authAction";
import { CheckCircle2, XCircle } from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 8 characters",            test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)",        test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number (0–9)",                  test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (@$!%*?&#)",  test: (p: string) => /[@$!%*?&#_\-]/.test(p) },
];

function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const ruleResults    = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passes: r.test(password) })), [password]);
  const isPasswordValid = ruleResults.every((r) => r.passes);
  const showRules       = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      await register(username, email, password);
      router.push("/confirm");
    } catch (err: any) {
      setErrorMessage(err?.message || "We couldn't complete your registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FEFDFD] max-w-md w-full px-10 py-8 rounded-3xl border border-gray-100 flex flex-col"
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
          className="w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <PasswordToggle
          id="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="e.g. Password123@"
          className={`w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border outline-none focus:ring-2 transition ${
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
                {rule.passes
                  ? <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  : <XCircle className="w-3 h-3 flex-shrink-0" />}
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
          {isLoading
            ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : "Register"}
        </button>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <p className="mt-5 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterUser;
