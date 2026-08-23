"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validators/auth";
import { registerRequest } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="mx-auto mt-20 max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Create your FixItNow account
        </h1>

        <p className="text-sm text-muted-foreground">
          Register as a customer or technician.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <Label htmlFor="role">Register as</Label>

          <select
            id="role"
            {...register("role")}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="TECHNICIAN">Technician</option>
          </select>

          {errors.role && (
            <p className="mt-1 text-sm text-red-500">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </div>
  );
}