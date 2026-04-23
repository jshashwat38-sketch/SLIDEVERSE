"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "@/actions/authActions";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      // 1. Check local storage first (fast)
      const storedUser = localStorage.getItem("mock_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 2. Check Supabase Auth for OAuth users (Google)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const oauthUser = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "Operative",
          email: session.user.email || ""
        };
        setUser(oauthUser);
        localStorage.setItem("mock_user", JSON.stringify(oauthUser));
      }
      
      setIsLoading(false);
    }
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const oauthUser = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "Operative",
          email: session.user.email || ""
        };
        setUser(oauthUser);
        localStorage.setItem("mock_user", JSON.stringify(oauthUser));
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem("mock_user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await loginUser(email, pass);
    
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem("mock_user", JSON.stringify(res.user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const googleLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  const register = async (data: any) => {
    setIsLoading(true);
    const res = await registerUser(data);
    
    if (res.success && res.user) {
      // We don't automatically log in after registration in this flow
      // as sign-in page expects registered=true param
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mock_user");
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
