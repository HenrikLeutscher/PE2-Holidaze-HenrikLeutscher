import type { Login } from "../types/authContext";
import { BASE_API_URL } from "./api";

export const loginReq = async (input: Login) => {
  const response = await fetch(`${BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result.data;
};
