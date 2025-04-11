import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  // Sign in function
  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
          // Create user object without password
          const loggedInUser = {
            email: DEMO_USER.email,
            fullName: DEMO_USER.fullName,
            profileImageUrl: DEMO_USER.profileImageUrl,
          };
          
          // Save to state and localStorage
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate network delay
    });
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    return Promise.resolve();
  };

  // Auth context value
  const value = {
    user,
    isSignedIn: !!user,
    isLoaded,
    signIn,
    signOut,
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