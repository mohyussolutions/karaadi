"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAuthenticatedUser } from "@/actions/core/authAction";
import { RawUserData } from "@/app/utils/types/user.types";

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

let _cachedSession: { data: any } | null = null;
let _pendingSession: Promise<RawUserData | null> | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RawUserData | null>(
    _cachedSession ? _cachedSession.data : null,
  );
  const [loading, setLoading] = useState(!_cachedSession);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (_cachedSession) {
      setUser(_cachedSession.data);
      setLoading(false);
      return;
    }

    if (!_pendingSession) {
      _pendingSession = getAuthenticatedUser();
    }

    _pendingSession
      .then((data) => {
        _cachedSession = { data: data ?? null };
        _pendingSession = null;
        setUser(data ?? null);
        setLoading(false);
      })
      .catch(() => {
        _cachedSession = { data: null };
        _pendingSession = null;
        setLoading(false);
      });
  }, []);

  const updateUser = (newUser: any) => {
    _cachedSession = { data: newUser };
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
