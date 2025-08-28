import React, { createContext, useState, useContext} from "react";
import type { ReactNode } from "react";

// Define the shape of the User object to include the name
interface User {
  name: string | null; // Name can be a string or null
  email: string;
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState< User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // In a real app, you'd also save a token to localStorage here
  };

  const logout = () => {
    setUser(null);
    // In a real app, you'd also remove the token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
