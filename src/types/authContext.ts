import type { Profile } from "./profile";

export interface Login {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: Profile | null;
  token: string | null;
  login: (input: Login) => Promise<void>;
  logout: () => void;
}
