import { api, setToken } from "./client";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: "USER" | "VERIFIED_RESIDENT" | "VERIFICATION_OFFICER" | "FIELD_OFFICER" | "ADMIN";
  area: string | null;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", { email, password }, { auth: false });
  setToken(res.token);
  return res;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", { name, email, password }, { auth: false });
  setToken(res.token);
  return res;
}

export function logout() {
  setToken(null);
}
