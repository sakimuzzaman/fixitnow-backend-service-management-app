
import { apiFetch, ApiResponse } from "./fetcher";

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginData {
  token: string;
  user: User;
}

export function loginRequest(payload: {
  email: string;
  password: string;
}) {
  return apiFetch<ApiResponse<LoginData>>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) {
  return apiFetch<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export function meRequest() {
  return apiFetch<ApiResponse<User>>("/auth/me");
}