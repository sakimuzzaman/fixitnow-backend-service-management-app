"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCategories } from "@/hooks/useServices";
import {
  createService,
  CreateServicePayload,
} from "@/lib/api/services";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewServicePage() {
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } =
    useCategories();

  const [form, setForm] = useState<CreateServicePayload>({
    title: "",
    description: "",
    price: 0,
    duration: 0,
    location: "",
    categoryId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof CreateServicePayload,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "duration"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createService(form);

      router.push("/dashboard/technician/services");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create service."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Add New Service
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a service that customers can book.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Service Title
          </label>

          <Input
            value={form.title}
            onChange={(e) =>
              handleChange("title", e.target.value)
            }
            placeholder="e.g. AC Repair"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              handleChange(
                "description",
                e.target.value
              )
            }
            placeholder="Describe your service..."
            className="min-h-30 w-full rounded-md border bg-background p-3 text-sm"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <select
            value={form.categoryId}
            onChange={(e) =>
              handleChange(
                "categoryId",
                e.target.value
              )
            }
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            disabled={categoriesLoading}
            required
          >
            <option value="">
              Select a category
            </option>

            {Array.isArray(categories) &&
              categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Price (BDT)
          </label>

          <Input
            type="number"
            min="0"
            value={form.price || ""}
            onChange={(e) =>
              handleChange("price", e.target.value)
            }
            placeholder="800"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Duration (minutes)
          </label>

          <Input
            type="number"
            min="1"
            value={form.duration || ""}
            onChange={(e) =>
              handleChange(
                "duration",
                e.target.value
              )
            }
            placeholder="60"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Location
          </label>

          <Input
            value={form.location}
            onChange={(e) =>
              handleChange(
                "location",
                e.target.value
              )
            }
            placeholder="e.g. Dhaka"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}