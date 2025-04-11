import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
const AuthContext = createContext(null);

// API URL
const API_URL = 'http://localhost:5000/api';

// Set up axios with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Demo user credentials
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'password123',
  fullName: 'Demo User',
  profileImageUrl: null, // No profile image for demo user
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token validity with backend
      api.get('/auth/me')
        .catch(() => {
          // If token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
    }
    setIsLoaded(true);
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      // For demo purposes, allow the demo user to sign in without API call
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const demoUser = {
          _id: 'demo123',
          email: DEMO_USER.email,
          fullName: DEMO_USER.fullName,
          profileImageUrl: DEMO_USER.profileImageUrl,
        };
        
        // Save to state and localStorage
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', 'demo-token');
        return demoUser;
      }
      
      // Real API call for non-demo users
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Save to state and localStorage
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Sign up function
  const signUp = async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return Promise.resolve();
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const response = await api.patch('/users/profile', userData);
      const updatedUser = response.data;
      
      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  // Auth context value
  const value = {
    user,
    isSignedIn: !!user,
    isLoaded,
    signIn,
    signUp,
    signOut,
    updateProfile,
    api, // Expose API instance for components to use
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};