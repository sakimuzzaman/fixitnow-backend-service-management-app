"use client";

import { useIncomingBookings } from "@/hooks/useTechnicianDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TechnicianOverviewPage() {
  const { data: bookings, isLoading, isError, error } = useIncomingBookings();

  console.log("TECHNICIAN DASHBOARD BOOKINGS:", bookings);
console.log("IS LOADING:", isLoading);
console.log("IS ERROR:", isError);
console.log("ERROR:", error);

  const pending =
    bookings?.filter((booking) => booking.status === "REQUESTED").length ?? 0;

  const active =
    bookings?.filter((booking) =>
      ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(booking.status)
    ).length ?? 0;

  const completed =
    bookings?.filter((booking) => booking.status === "COMPLETED").length ?? 0;

  const earnings =
    bookings
      ?.filter((booking) => booking.status === "COMPLETED")
      .reduce((sum, booking) => sum + (booking.service?.price ?? 0), 0) ?? 0;

  const stats = [
    {
      label: "Pending Requests",
      value: pending,
    },
    {
      label: "Active Jobs",
      value: active,
    },
    {
      label: "Completed Jobs",
      value: completed,
    },
    {
      label: "Total Earnings",
      value: `৳${earnings.toLocaleString()}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-semibold">Overview</h1>

      {isError && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Could not load your booking statistics: {error.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-2xl font-semibold">
                  {stat.value}
                </CardContent>
              </Card>
            ))}
      </div>

        <div className="flex flex-wrap gap-3">
  <Button className="bg-cyan-400">
    <Link href="/dashboard/technician/services">
      My Services
    </Link>
  </Button>

  <Button variant="outline"  className="bg-orange-300">
    <Link href="/dashboard/technician/bookings">
      My Bookings
    </Link>
  </Button>

  <Button variant="outline" className="bg-green-300" >
    <Link href="/dashboard/technician/profile">
      My Profile
    </Link>
  </Button>
</div>

    </div>
  );
}
