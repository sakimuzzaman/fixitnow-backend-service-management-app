import { getToken } from "@/lib/auth/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export interface ApiResponse<T, M = undefined> {
  success: boolean;
  message: string;
  data: T;
  meta?: M;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...headers,
  };

  // Only send JSON Content-Type when there is actually a request body
  if (body !== undefined) {
    (finalHeaders as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  if (auth) {
    const token = getToken();

    if (token) {
      (finalHeaders as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let data: unknown = null;

  const text = await res.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ||
      `Request failed (${res.status})`;

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}