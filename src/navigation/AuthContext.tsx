/**
 * Authentication Context Example
 * This is a placeholder - replace with your actual authentication logic
 * 
 * Usage:
 * 1. Wrap your app with AuthProvider
 * 2. Use useAuth hook in components
 * 3. Update RootNavigator to use isAuthenticated from context
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: { id: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const login = () => {
    // TODO: Replace with actual login logic
    setIsAuthenticated(true);
    setUser({ id: '1', email: 'user@example.com' });
  };

  const logout = () => {
    // TODO: Replace with actual logout logic
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

