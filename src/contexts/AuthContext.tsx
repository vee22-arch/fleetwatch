"use client";

import type { User, UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage on initial load
    try {
      const storedUser = localStorage.getItem('fleetwatch_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('fleetwatch_user');
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, role: UserRole) => {
    const newUser: User = { id: role === 'admin' ? 'admin_user' : `staff_${username}`, username, role };
    setUser(newUser);
    localStorage.setItem('fleetwatch_user', JSON.stringify(newUser));
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/staff/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleetwatch_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
