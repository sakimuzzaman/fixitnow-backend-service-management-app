"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  registerSchema,
  RegisterInput,
} from "@/lib/validators/auth";
import { registerRequest } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerRequest,

    onSuccess: (response) => {
      toast.success(
        response.message || "Account created successfully!"
      );

      // Registration does not return a JWT token,
      // so redirect the user to the login page.
      router.push("/auth/login");
    },

    onError: (error) => {
      toast.error(
        error?.message ||
          "Registration failed. Please check your information and try again."
      );
    },
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        {/* Background decoration */}
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        {/* Register Card */}
        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {/* Header */}
            <div className="border-b border-slate-100 px-6 pb-6 pt-8 text-center sm:px-8">
              {/* Brand Icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-xl shadow-md shadow-cyan-500/20">
                🔧
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join FixItNow and connect with trusted home service
                professionals.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-7 sm:px-8">
              <form
                onSubmit={handleSubmit((data) =>
                  mutation.mutate(data)
                )}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full name
                  </Label>

                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="h-11 border-slate-200 bg-slate-50/50 transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-cyan-500"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

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
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="h-11 border-slate-200 bg-slate-50/50 transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-cyan-500"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium text-slate-700"
                  >
                    Register as
                  </Label>

                  <select
                    id="role"
                    {...register("role")}
                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="">
                      Select a role
                    </option>

                    

                    <option value="CUSTOMER">
                      Customer
                    </option>

                    <option value="TECHNICIAN">
                      Technician
                    </option>
                  </select>

                  {errors.role && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full bg-slate-900 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>
              </form>

              {/* Login */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-slate-400">
            Securely create your FixItNow account
          </p>
        </div>
      </div>
    </main>
  );
}

