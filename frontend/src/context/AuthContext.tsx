"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAuthenticatedUser } from "@/actions/core/authAction";
import { RawUserData } from "@/app/utils/types/user.types";
import {
  cachedSession,
  pendingSession,
  setCachedSession,
  setPendingSession,
} from "./authCache";

type AuthContextType = {
  user: RawUserData | null;
  loading: boolean;
  setUser: (user: RawUserData | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RawUserData | null>(
    cachedSession ? cachedSession.data : null,
  );
  const [loading, setLoading] = useState(!cachedSession);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (cachedSession) {
      setUser(cachedSession.data);
      setLoading(false);
      return;
    }

    if (!pendingSession) {
      setPendingSession(getAuthenticatedUser());
    }

    pendingSession!
      .then((data) => {
        setCachedSession(data ?? null);
        setPendingSession(null);
        setUser(data ?? null);
        setLoading(false);
      })
      .catch(() => {
        setPendingSession(null);
        setLoading(false);
      });
  }, []);

  const updateUser = (newUser: RawUserData | null) => {
    setCachedSession(newUser);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
