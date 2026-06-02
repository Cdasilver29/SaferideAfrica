import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Profile, RegisterInput,
  getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister, setLocalRole,
} from '@/api/auth';

interface AuthContextValue {
  user:        Profile | null;
  loading:     boolean;
  signIn:      (email: string, password: string) => Promise<void>;
  signUp:      (input: RegisterInput) => Promise<void>;
  signOut:     () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchRole:  (role: Profile['role']) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(p => {
      setUser(p);
      setLoading(false);
    });
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const profile = await apiLogin(email, password);
    setUser(profile);
  };

  const signUp: AuthContextValue['signUp'] = async (input) => {
    await apiRegister(input);
    const profile = await apiLogin(input.email, input.password);
    setUser(profile);
  };

  const signOut: AuthContextValue['signOut'] = async () => {
    await apiLogout();
    setUser(null);
  };

  const refreshUser: AuthContextValue['refreshUser'] = async () => {
    const profile = await getCurrentUser();
    setUser(profile);
  };

  // Dev-only: toggle local role for testing admin view (no real backend role assignment)
  const switchRole: AuthContextValue['switchRole'] = async (role) => {
    if (!user) return;
    const updated = await setLocalRole(user.email, role);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
