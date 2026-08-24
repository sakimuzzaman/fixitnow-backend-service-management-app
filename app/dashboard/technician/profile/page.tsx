"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  useMyProfile,
  useUpdateProfile,
} from "@/hooks/useTechnicianDashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
  skills: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  avatar: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function TechnicianProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  const mutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        bio: profile.bio ?? "",
        skills: profile.skills?.join(", ") ?? "",
        experienceYears: profile.experienceYears ?? undefined,
        hourlyRate: profile.hourlyRate ?? undefined,
        avatar: profile.avatar ?? "",
      });
    }
  }, [profile, reset]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  function onSubmit(values: FormValues) {
    mutation.mutate({
      name: values.name.trim(),
      bio: values.bio?.trim() || undefined,
      experienceYears: values.experienceYears,
      hourlyRate: values.hourlyRate,
      avatar: values.avatar?.trim() || undefined,
      skills: values.skills
        ?.split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8">
      <h1 className="text-xl font-semibold">Your Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>

          <Textarea
            id="bio"
            {...register("bio")}
          />

          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <Label htmlFor="skills">
            Skills (comma-separated)
          </Label>

          <Input
            id="skills"
            {...register("skills")}
            placeholder="Plumbing, Electrical"
          />
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experienceYears">
            Years of experience
          </Label>

          <Input
            id="experienceYears"
            type="number"
            min="0"
            {...register("experienceYears", {
              setValueAs: (value) =>
                value === "" ? undefined : Number(value),
            })}
          />

          {errors.experienceYears && (
            <p className="mt-1 text-sm text-red-500">
              {errors.experienceYears.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="hourlyRate">Hourly rate</Label>
          <Input id="hourlyRate" type="number" min="0" {...register("hourlyRate", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
          {errors.hourlyRate && <p className="mt-1 text-sm text-red-500">{errors.hourlyRate.message}</p>}
        </div>

        <div>
          <Label htmlFor="avatar">Profile picture URL</Label>
          <Input id="avatar" type="url" placeholder="https://example.com/photo.jpg" {...register("avatar")} />
          {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Saving..."
            : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
