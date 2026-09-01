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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-lg shadow-sm transition group-hover:bg-cyan-600">
            🔧
          </span>

          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              FixItNow
            </span>

            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
              Service Platform
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5 text-sm font-medium">
          <Link
            href="/services"
            className="rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Services
          </Link>

          {user && dashboardUrl ? (
            <>
              <Link
                href={dashboardUrl}
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="ml-1 border-slate-200 bg-white font-medium text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Log in
              </Link>

              <Button
                size="sm"
                className="ml-1 bg-slate-900 px-4 font-medium text-white shadow-sm transition-all hover:bg-slate-800"
                
              >
                <Link href="/auth/register">
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

