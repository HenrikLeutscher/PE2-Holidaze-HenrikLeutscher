import { createContext, useState } from "react";
import type { AuthContextType, Login } from "../types/authContext";
import { Profile } from "../types/profile";
import { loginReq } from "../api/login";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(user);

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const login = async (input: Login) => {
    try {
      const data = await loginReq(input);
      setUser(data);
      setToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.accessToken);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error("Invalid Email or Password");
      } else {
        throw new Error("An unknown error occurred during login.");
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
