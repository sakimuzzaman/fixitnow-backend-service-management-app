"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/fetcher";
import { getToken } from "@/lib/auth/token";
import { meRequest } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 30_000 },
          mutations: {
            onError: (error) => {
              const message =
                error instanceof ApiError ? error.message : "Something went wrong";
              toast.error(message);
            },
          },
        },
      })
  );

  useEffect(() => {
    const token = getToken();

    if (token) {
      // meRequest()
      //   .then((user) => {
      //     useAuthStore.getState().setAuth(user, token);
      //   })
      meRequest()
        .then((response) => {
             useAuthStore.getState().setAuth(response.data, token);
         })
        .catch(() => {
          useAuthStore.getState().setLoading(false);
        });
    } else {
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}