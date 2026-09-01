"use client";

import { useState } from "react";
import Link from "next/link";

import {
  useMyServices,
} from "@/hooks/useServices";

import {
  deleteService,
} from "@/lib/api/services";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

export default function TechnicianServicesPage() {
  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyServices();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteService(id);

      await refetch();
    } catch (error) {
      console.error("Failed to delete service:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete service."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            My Services
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage the services you offer to customers.
          </p>
        </div>

        <Button className="bg-cyan-400">
          <Link href="/dashboard/technician/services/new">
            + Add Service
          </Link>
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <p>
            {error instanceof Error
              ? error.message
              : "Could not load your services."}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>

              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        services?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <h2 className="text-lg font-semibold">
                No services yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                You have not created any services yet.
                Create your first service so customers can
                discover and book it.
              </p>

              <Button className="mt-5">
                <Link href="/dashboard/technician/services/new">
                  Create Your First Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

      {/* Services */}
      {!isLoading &&
        !isError &&
        services &&
        services.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        {service.title}
                      </CardTitle>

                      {service.category && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {service.category.name}
                        </p>
                      )}
                    </div>

                    <span
                      className={
                        service.isActive !== false
                          ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                          : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      }
                    >
                      {service.isActive !== false
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Price
                      </span>

                      <span className="font-semibold">
                        ৳{service.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Duration
                      </span>

                      <span>
                        {service.duration} minutes
                      </span>
                    </div>

                    {service.location && (
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          Location
                        </span>

                        <span className="text-right">
                          {service.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-5">
                   

                    <Button
                      variant="destructive"
                      className="bg-red-500"
                      disabled={deletingId === service.id}
                      onClick={() =>
                        handleDelete(service.id)
                      }
                    >
                      {deletingId === service.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}