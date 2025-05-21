"use client";

import type { User } from 'firebase/auth'; // Using User type for structure, not full Firebase
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null; // Using Firebase User type as a well-defined structure
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Simplified login
  signup: (email: string, pass: string) => Promise<void>; // Simplified signup
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data structure (subset of Firebase User)
const mockUser: User = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Mock User',
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null}),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  providerId: 'password'
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for persisted login state (e.g., in localStorage)
    const storedUser = localStorage.getItem('wifiZenUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const loggedInUser = { ...mockUser, email };
    setUser(loggedInUser);
    localStorage.setItem('wifiZenUser', JSON.stringify(loggedInUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const signup = async (email: string, _pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const signedUpUser = { ...mockUser, email };
    setUser(signedUpUser);
    localStorage.setItem('wifiZenUser', JSON.stringify(signedUpUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const logout = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('wifiZenUser');
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
