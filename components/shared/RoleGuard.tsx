// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import { meRequest, Role } from "@/lib/api/auth";
// import { getToken, clearToken } from "@/lib/auth/token";
// import { Skeleton } from "../ui/skeleton";


// export function RoleGuard({
//   allow,
//   children,
// }: {
//   allow: Role;
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { user, setAuth, logout } = useAuthStore();
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     async function verify() {
//       const token = getToken();
//       if (!token) {
//         router.replace("/auth/login");
//         return;
//       }
//       try {
//         // If store already has the user (e.g. from login), skip the refetch.
//         const freshUser = user ?? (await meRequest());
//         if (!user) setAuth(freshUser, token);

//         if (freshUser.role !== allow) {
//           router.replace("/"); // wrong role trying to access this dashboard
//           return;
//         }
//         setChecked(true);
//       } catch {
//         clearToken();
//         logout();
//         router.replace("/auth/login");
//       }
//     }
//     verify();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allow]);

//   if (!checked) {
//     return (
//       <div className="p-8 space-y-4">
//         <Skeleton className="h-8 w-64" />
//         <Skeleton className="h-40 w-full" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import { meRequest, Role } from "@/lib/api/auth";
// import { getToken, clearToken } from "@/lib/auth/token";
// import { Skeleton } from "../ui/skeleton";

// export function RoleGuard({
//   allow,
//   children,
// }: {
//   allow: Role;
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   const { user, setAuth, logout } = useAuthStore();

//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     async function verify() {
//       const token = getToken();

//       // No token means the user is not authenticated.
//       if (!token) {
//         router.replace("/auth/login");
//         return;
//       }

//       try {
//         let currentUser = user;

//         // If Zustand does not already have the user,
//         // fetch the current user from the backend.
//         if (!currentUser) {
//           const response = await meRequest();

//           // IMPORTANT:
//           // meRequest() returns { success, message, data: user }
//           // so we need response.data.
//           currentUser = response.data;

//           setAuth(currentUser, token);
//         }

//         // Check whether the logged-in user's role
//         // is allowed to access this dashboard.
//         if (currentUser.role !== allow) {
//           router.replace("/");
//           return;
//         }

//         setChecked(true);
//       } catch (error) {
//         console.error("RoleGuard authentication error:", error);

//         clearToken();
//         logout();

//         router.replace("/auth/login");
//       }
//     }

//     verify();

//     // We intentionally run this when the allowed role changes.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allow]);

//   if (!checked) {
//     return (
//       <div className="space-y-4 p-8">
//         <Skeleton className="h-8 w-64" />
//         <Skeleton className="h-40 w-full" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }



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