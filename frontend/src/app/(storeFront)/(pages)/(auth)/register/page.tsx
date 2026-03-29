"use client";

import React, { useState } from "react";
import Link from "next/link";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { useRouter } from "next/navigation";
import { register } from "@/actions/core/authAction";

function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          placeholder="Enter your password"
          className="mb-6 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-bold py-4 rounded-3xl shadow-md transition`}
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
