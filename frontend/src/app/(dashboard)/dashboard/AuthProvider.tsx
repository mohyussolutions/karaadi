"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/actions/core/authAction";

interface AuthContextType {
  user: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(user === undefined);
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      (async () => {
        try {
          const session = await apiService.verifySession();
          setUser(session);
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
