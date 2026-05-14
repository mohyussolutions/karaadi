"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/core/authAction";

const PASSWORD_RULES = [
  { label: "At least 8 characters",           test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)",       test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number (0–9)",                 test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (@$!%*?&#)", test: (p: string) => /[@$!%*?&#_\-]/.test(p) },
];

export function useRegister() {
  const [username, setUsername]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const ruleResults     = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passes: r.test(password) })), [password]);
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

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading,
    errorMessage,
    ruleResults,
    isPasswordValid,
    showRules,
    handleSubmit,
  };
}

export { PASSWORD_RULES };
