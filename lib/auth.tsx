// lib/auth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin' | 'partner';
  loginTime: Date;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials - in productie zou dit via een backend API gaan
const DEMO_CREDENTIALS = [
  {
    username: 'admin',
    password: 'repkot2025',
    role: 'admin' as const
  },
  {
    username: 'partner1',
    password: 'partner1',
    role: 'partner' as const
  },
  {
    username: 'partner2',
    password: 'partner2',
    role: 'partner' as const
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('repkot_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Check if session is still valid (e.g., less than 24 hours old)
        const loginTime = new Date(parsedUser.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('repkot_user');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('repkot_user');
      }
    }
  }, []);

  const login = (credentials: { username: string; password: string }): boolean => {
    const matchedUser = DEMO_CREDENTIALS.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );

    if (matchedUser) {
      const user: User = {
        username: matchedUser.username,
        role: matchedUser.role,
        loginTime: new Date()
      };
      
      setUser(user);
      localStorage.setItem('repkot_user', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('repkot_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return null; // This will be handled by the main app component
    }
    
    return <Component {...props} />;
  };
}
