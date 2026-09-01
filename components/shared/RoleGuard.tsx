"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { meRequest, Role } from "@/lib/api/auth";
import { getToken, clearToken } from "@/lib/auth/token";
import { Skeleton } from "../ui/skeleton";

interface RoleGuardProps {
  allow: Role;
  children: React.ReactNode;
}

export function RoleGuard({
  allow,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      const token = getToken();

      console.log("RoleGuard token:", token);
      console.log("RoleGuard Zustand user:", user);
      console.log("Required role:", allow);

      // No JWT token
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      try {
        let currentUser = user;

        // User isn't currently in Zustand.
        // Get it from the backend using the JWT.
        if (!currentUser) {
          const response = await meRequest();

          console.log("RoleGuard /me response:", response);

          currentUser = response.data;

          setAuth(currentUser, token);
        }

        // Check role
        if (currentUser.role !== allow) {
          console.log(
            `Role mismatch: user=${currentUser.role}, required=${allow}`
          );

          router.replace("/");

          return;
        }

        if (mounted) {
          setChecked(true);
        }
      } catch (error) {
        console.error("RoleGuard authentication error:", error);

        clearToken();
        logout();

        router.replace("/auth/login");
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [allow, user, router, setAuth, logout]);

  if (!checked) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}