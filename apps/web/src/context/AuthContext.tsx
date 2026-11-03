import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import i18n from '../i18n';

interface User {
  id: string;
  phone: string;
  name: string | null;
  preferredLanguage: string;
  isVerified: boolean;
  profile?: {
    id: string;
    villageId: string | null;
    landAcreage: number | null;
    isEquipmentOwner: boolean;
    village?: {
      id: string;
      nameEn: string;
      nameMr: string;
      nameHi: string;
      district: string;
    } | null;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<{ success: boolean; demoCode?: string; message: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  quickLogin: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLanguage: (lang: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.getMe();
      if (res.data) {
        setUser(res.data);
        if (res.data.preferredLanguage) {
          i18n.changeLanguage(res.data.preferredLanguage);
          localStorage.setItem('parijat_lang', res.data.preferredLanguage);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const requestOtp = async (phone: string) => {
    const res = await api.requestOtp(phone);
    return res.data;
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const res = await api.verifyOtp(phone, otp);
    const { token, user: loggedInUser } = res.data;
    if (token) {
      localStorage.setItem('parijat_token', token);
    }
    setUser(loggedInUser);
    if (loggedInUser.preferredLanguage) {
      i18n.changeLanguage(loggedInUser.preferredLanguage);
      localStorage.setItem('parijat_lang', loggedInUser.preferredLanguage);
    }
  };

  const quickLogin = async (phone: string) => {
    await requestOtp(phone);
    await verifyOtp(phone, '123456');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('parijat_token');
      setUser(null);
    }
  };

  const updateLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('parijat_lang', lang);
    if (user) {
      setUser({ ...user, preferredLanguage: lang });
      try {
        await api.updateProfile({ preferredLanguage: lang });
      } catch {
        // Ignore network error on pref save
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        requestOtp,
        verifyOtp,
        quickLogin,
        logout,
        updateLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
