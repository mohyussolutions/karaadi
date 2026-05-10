"use client";
export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { useRouter } from "next/navigation";
import { register } from "@/actions/core/authAction";
import { CheckCircle2, XCircle } from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 8 characters",          test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)",      test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number (0–9)",                test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (@$!%*?&#)", test: (p: string) => /[@$!%*?&#_\-]/.test(p) },
];

function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passes: r.test(password) })),
    [password],
  );
  const isPasswordValid = ruleResults.every((r) => r.passes);
  const showRules = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      await register(username, email, password);
      router.push("/confirm");
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "We couldn't complete your registration. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFDFD] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl flex flex-col"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-900">
          Create Account
        </h1>
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-600">
          Register
        </h2>

        <label
          htmlFor="username"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Choose a username"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Password
        </label>
        <PasswordToggle
          id="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="e.g. Password123@"
          className={`px-5 py-3 rounded-2xl bg-gray-100 border transition ${
            showRules && !isPasswordValid
              ? "border-red-400 focus:ring-red-300"
              : showRules && isPasswordValid
                ? "border-green-400 focus:ring-green-300"
                : "border-gray-300 focus:ring-blue-400"
          } focus:outline-none focus:ring-4 focus:border-transparent`}
        />

        {showRules && (
          <ul className="mt-3 mb-5 space-y-1.5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            {ruleResults.map((rule) => (
              <li
                key={rule.label}
                className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                  rule.passes ? "text-green-600" : "text-red-500"
                }`}
              >
                {rule.passes ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={isLoading || (showRules && !isPasswordValid)}
          className={`w-full font-bold py-4 rounded-3xl shadow-md transition text-white ${
            isLoading || (showRules && !isPasswordValid)
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {errorMessage && (
          <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
        )}

        <p className="mt-8 text-center text-gray-700 w-full">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterUser;
