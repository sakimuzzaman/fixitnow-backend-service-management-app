import Cookies from "js-cookie";

const TOKEN_KEY = "fixitnow_token";

// Cookie (not httpOnly, since we set it client-side) lets Middleware read it too.
export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax" });
}

export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(TOKEN_KEY);
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY);
}