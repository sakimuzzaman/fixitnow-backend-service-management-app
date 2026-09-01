"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validators/auth";
import { loginRequest } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginRequest,

    onSuccess: (response) => {
      console.log("========== LOGIN SUCCESS ==========");
      console.log("Full response:", response);
      console.log("Response data:", response?.data);

      if (!response?.data) {
        console.error("Login response does not contain data");
        toast.error("Invalid login response from server.");
        return;
      }

      const { token, user } = response.data;

      console.log("Token:", token);
      console.log("User:", user);
      console.log("Role:", user?.role);

      if (!token || !user) {
        console.error("Missing token or user:", {
          token,
          user,
        });

        toast.error("Login response is missing authentication data.");
        return;
      }

      setAuth(user, token);

      console.log("Authentication stored.");

      toast.success("Welcome back!");

      if (user.role === "CUSTOMER") {
        console.log("Redirecting to customer dashboard...");
        router.replace("/dashboard/customer");
      } else if (user.role === "TECHNICIAN") {
        console.log("Redirecting to technician dashboard...");
        router.replace("/dashboard/technician");
      } else if (user.role === "ADMIN") {
        console.log("Redirecting to admin dashboard...");
        router.replace("/dashboard/admin");
      } else {
        console.error("Invalid role:", user.role);
        toast.error("Invalid user role.");
      }
    },

    onError: (error) => {
      toast.error(
        error?.message || "Login failed. Please check your credentials."
      );
    },
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        {/* Background decoration */}
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />

        {/* Login Card */}
        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {/* Card Header */}
            <div className="border-b border-slate-100 px-6 pb-6 pt-8 text-center sm:px-8">
              {/* Brand Icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-xl shadow-md shadow-cyan-500/20">
                🔧
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Log in to your FixItNow account and continue managing your
                services.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-7 sm:px-8">
              <form
                onSubmit={handleSubmit((data) => mutation.mutate(data))}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 border-slate-200 bg-slate-50/50 transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-cyan-500"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </Label>
                  </div>

                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 border-slate-200 bg-slate-50/50 transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-cyan-500"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full bg-slate-900 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Logging in..." : "Log in"}
                </Button>
              </form>

              {/* Register */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Do not have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security message */}
          <p className="mt-5 text-center text-xs text-slate-400">
            Secure access to your FixItNow account
          </p>
        </div>
      </div>
    </main>
  );
}

