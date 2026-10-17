import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, profileAPI, apiUtils } from '../services/api';
import { toast } from 'react-toastify';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: { first_name?: string; last_name?: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiUtils.isAuthenticated()) {
          await refreshProfile();
        }
      } catch (error) {
        // Token might be invalid, clear it
        apiUtils.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });

      if (!response?.user || typeof response.user !== 'object' ||
          typeof response.tokens?.access !== 'string' || typeof response.tokens?.refresh !== 'string') {
        throw new Error('The server returned an invalid login response. Please try again.');
      }

      // Store tokens and user data
      apiUtils.setTokens(response.tokens.access, response.tokens.refresh);
      apiUtils.setUser(response.user);
      setUser(response.user);

      toast.success('Login successful!');
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => {
    try {
      setLoading(true);
      const response = await authAPI.signup(userData);

      // Store tokens and user data
      apiUtils.setTokens(response.tokens.access, response.tokens.refresh);
      apiUtils.setUser(response.user);
      setUser(response.user);

      toast.success('Account created successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.email?.[0] ||
                          error.response?.data?.non_field_errors?.[0] ||
                          'Signup failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on backend, we should clear local tokens
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local tokens and state
      apiUtils.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData: { first_name?: string; last_name?: string }) => {
    try {
      const response = await profileAPI.updateProfile(profileData);

      // Update local user state
      const updatedUser = { ...user, ...response.user };
      setUser(updatedUser);
      apiUtils.setUser(updatedUser);

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const profileData = await profileAPI.getProfile();
      setUser(profileData);
      apiUtils.setUser(profileData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, clear auth
        apiUtils.clearTokens();
        setUser(null);
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
