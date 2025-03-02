import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate(); // React Router hook for navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  // Load authentication state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole");

    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const login = (token: string, role: string) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem("authToken", token); // Save token
    localStorage.setItem("authRole", role); // Save role
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("authToken"); // Clear token
    localStorage.removeItem("authRole"); // Clear role
    setTimeout(() => navigate("/login"), 1000); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
