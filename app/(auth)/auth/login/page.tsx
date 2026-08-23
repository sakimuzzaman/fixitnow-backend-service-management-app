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

    // onSuccess: (response) => {
    //   const { token, user } = response.data;

    //   console.log("Logged-in user:", user);
    //   console.log("User role:", user.role);

    //   // Store user and JWT token
    //   setAuth(user, token);

    //   toast.success("Welcome back!");

    //   switch (user.role) {
    //     case "CUSTOMER":
    //       router.push("/dashboard/customer");
    //       break;

    //     case "TECHNICIAN":
    //       router.push("/dashboard/technician");
    //       break;

    //     case "ADMIN":
    //       router.push("/dashboard/admin");
    //       break;

    //     default:
    //       toast.error("Invalid user role.");
    //   }
    // },

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

    onError: (error: any) => {
      toast.error(
        error?.message || "Login failed. Please check your credentials."
      );
    },
  });

  return (
    <div className="mx-auto mt-20 max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">
        Log in to FixItNow
      </h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
}