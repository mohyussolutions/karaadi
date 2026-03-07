"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { login, verifySession } from "@/actions/core/authAction";
import LoginLoading from "@/app/(storeFront)/components/shared/Loading/LoginLoading";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    verifySession()
      .then((userData) => {
        if (userData) {
          router.replace("/");
        } else {
          setIsCheckingSession(false);
        }
      })
      .catch(() => setIsCheckingSession(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      if (user.isAdmin) window.location.href = "/dashboard";
      else if (user.isManager) window.location.href = "/managers";
      else if (user.isSupport) window.location.href = "/support";
      else window.location.href = "/";
    } catch (err: any) {
      setIsLoading(false);
      if (err.message?.includes("429")) {
        setError("Too many attempts. Please wait 15 minutes.");
      } else if (
        err.message?.includes("disabled") ||
        err.message?.includes("locked")
      ) {
        setError("Account locked. Reset password or contact support.");
      } else {
        setError("Login failed. Check your credentials.");
      }
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          Welcome Back!
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600">
          Login to your account
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full mb-4 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300"
        />

        <PasswordToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300"
        />

        <div className="flex justify-between mb-6">
          <Link href="/forgot-password" className="text-blue-600 text-sm">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-3xl"
        >
          {isLoading ? <LoginLoading /> : "Login"}
        </button>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="mt-8 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
