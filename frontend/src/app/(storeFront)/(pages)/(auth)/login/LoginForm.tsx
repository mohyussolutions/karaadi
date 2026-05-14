"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { login } from "@/actions/core/authAction";
import { setAuthCookies } from "@/actions/core/cookieActions";
import PasswordToggle from "../PasswordVisibility/PasswordToggle";
import { useAuth } from "@/context/AuthContext";

const inputCls = "w-full mb-3 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser) {
        setUser(loggedInUser);

        const role = loggedInUser.isAdmin
          ? "admin"
          : loggedInUser.isManager
          ? "manager"
          : loggedInUser.isSupport
          ? "support"
          : "user";

        await setAuthCookies(loggedInUser.token, loggedInUser.accessToken, role);

        const dest = loggedInUser.isAdmin
          ? "/dashboard"
          : loggedInUser.isManager
          ? "/managers"
          : loggedInUser.isSupport
          ? "/support"
          : "/";
        window.location.href = dest;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("auth.login.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full px-10 py-8 rounded-3xl border border-gray-100"
      >
        <h1 className="text-3xl font-extrabold mb-1 text-center text-gray-900">
          {t("auth.login.title")}
        </h1>
        <p className="text-center text-base mb-6 text-gray-600">
          {t("auth.login.subtitle")}
        </p>

        <input
          type="email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.login.emailPlaceholder")}
          required
          className={inputCls}
        />

        <PasswordToggle
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.login.passwordPlaceholder")}
          className={inputCls}
        />

        <div className="flex justify-end mb-5">
          <Link href="/forgot-password" className="text-blue-600 text-sm font-medium hover:underline">
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-3xl flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading
            ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : t("auth.login.loginButton")}
        </button>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <p className="mt-5 text-center text-gray-600">
          {t("auth.login.noAccount")}{" "}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            {t("auth.login.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
