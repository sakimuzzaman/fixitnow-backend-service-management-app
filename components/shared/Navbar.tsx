// "use client";

// import Link from "next/link";
// import { useAuthStore } from "@/store/authStore";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// const dashboardByRole = {
//   CUSTOMER: "/dashboard/customer",
//   TECHNICIAN: "/dashboard/technician",
//   ADMIN: "/dashboard/admin",
// };

// export function Navbar() {
//   const { user, logout } = useAuthStore();
//   const router = useRouter();

//   return (
//     <header className="border-b sticky top-0 bg-background z-50">
//       <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
//         <Link href="/" className="font-semibold text-lg">
//           FixItNow 🔧
//         </Link>
//         <nav className="flex items-center gap-4 text-sm">
//           <Link href="/services">Services</Link>
//           {user ? (
//             <>
//               <Link href={dashboardByRole[user.role]}>Dashboard</Link>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   logout();
//                   router.push("/");
//                 }}
//               >
//                 Log out
//               </Button>
//             </>
//           ) : (
//             <>
//               <Link href="/auth/login">Log in</Link>
//               <Button size="sm">
//                 <Link href="/auth/register">Sign up</Link>
//               </Button>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const dashboardByRole = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
} as const;

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const dashboardUrl = user
    ? dashboardByRole[user.role]
    : undefined;

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          FixItNow 🔧
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/services">Services</Link>

          {user && dashboardUrl ? (
            <>
              <Link href={dashboardUrl}>Dashboard</Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Log in</Link>

              <Button size="sm">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}