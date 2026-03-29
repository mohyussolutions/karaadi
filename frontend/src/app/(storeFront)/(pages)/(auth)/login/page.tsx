"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { login } from "@/actions/core/authAction";
import LoginLoading from "@/app/(storeFront)/components/shared/Loading/LoginLoading";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      if (user.isAdmin) router.push("/dashboard");
      else if (user.isManager) router.push("/managers");
      else if (user.isSupport) router.push("/support");
      else router.push("/");
    } catch (err: any) {
      setIsLoading(false);
      if (err.message?.includes("429")) {
        setError(t("auth.login.tooManyAttempts"));
      } else if (
        err.message?.includes("disabled") ||
        err.message?.includes("locked")
      ) {
        setError(t("auth.login.accountLocked"));
      } else {
        setError(t("auth.login.failed"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FEFDFD] max-w-md w-full p-10 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900">
          {t("auth.login.title")}
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600">
          {t("auth.login.subtitle")}
        </p>

        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.login.emailPlaceholder")}
          required
          className="w-full mb-4 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <PasswordToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.login.passwordPlaceholder")}
          className="w-full mb-4 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <div className="flex justify-end mb-6">
          <Link
            href="/forgot-password"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-3xl flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? <LoginLoading /> : t("auth.login.loginButton")}
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-center text-red-600 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-gray-600">
          {t("auth.login.noAccount")}{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            {t("auth.login.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
