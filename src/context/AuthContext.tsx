import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: 'user-1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  savedJobs: ['job-1', 'job-3', 'job-5'],
  preferences: {
    jobTypes: ['Full-time', 'Contract'],
    locations: ['New York', 'Remote'],
    experienceLevels: ['Mid level', 'Senior level'],
    remote: true,
    salary: {
      min: 80000,
      max: 150000
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, validate the token with the server
      // Here we'll use our mock user
      setAuthState({
        user: MOCK_USER,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock login process
      if (email === 'user@example.com' && password === 'password') {
        // Set mock token
        localStorage.setItem('token', 'mock-jwt-token');
        
        setAuthState({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid email or password'
      }));
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock registration process
      if (email && password && firstName && lastName) {
        // Set mock token
        localStorage.setItem('token', 'mock-jwt-token');
        
        const newUser: User = {
          ...MOCK_USER,
          email,
          firstName,
          lastName,
          savedJobs: []
        };
        
        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
    }
  };

  const logout = () => {
    // Remove token
    localStorage.removeItem('token');
    
    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser
      }}
    >
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