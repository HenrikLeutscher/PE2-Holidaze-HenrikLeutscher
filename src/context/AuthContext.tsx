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

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const fetchFullProfile = async (username: string, token: string) => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${username}?_venues=true&_bookings=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      const fullProfileData = await response.json();
      return fullProfileData.data;
    } catch (error) {
      console.error("Error fetching full profile:", error);
      return null;
    }
  };

  const login = async (input: Login) => {
    try {
      const loginData = await loginReq(input);

      const fullProfile = await fetchFullProfile(
        loginData.name,
        loginData.accessToken,
      );
      if (!fullProfile) {
        throw new Error("Failed to fetch full profile after login.");
      }

      setUser(fullProfile);
      setToken(loginData.accessToken);
      localStorage.setItem("user", JSON.stringify(fullProfile));
      localStorage.setItem("token", loginData.accessToken);
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
