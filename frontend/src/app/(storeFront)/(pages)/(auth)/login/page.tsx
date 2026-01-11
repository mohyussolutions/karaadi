"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import LoginLoading from "@/app/(storeFront)/components/shared/Loading/LoginLoading";
import { apiService } from "@/actions/core/authAction";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const userData = await apiService.verifySession();
        setUser(userData);
        if (userData) router.push("/");
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await apiService.login(email, password);

      console.log(user);

      if (user.isAdmin) {
        window.location.href = "/dashboard";
      } else if (user.isManager) {
        window.location.href = "/managers";
      } else if (user.isSupport) {
        window.location.href = "/support";
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked || user) return null;

  return (
    <div className="min-h-screen from-grey-50 via-white to-blue-200 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl flex flex-col"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900">
          Welcome Back!
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600 font-semibold">
          Login to your account
        </p>

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
          placeholder="Enter your password"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <div className="flex justify-between items-center mb-8">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl shadow-md transition flex justify-center items-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? <LoginLoading /> : "Login"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
        )}

        <p className="mt-8 text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
