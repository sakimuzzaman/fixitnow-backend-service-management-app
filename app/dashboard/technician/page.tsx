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
  const { data: bookings, isLoading, isError, error } =
    useIncomingBookings();

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
      description: "Requests waiting for action",
      accent: "bg-amber-500",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
    {
      label: "Active Jobs",
      value: active,
      description: "Currently active bookings",
      accent: "bg-blue-500",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      label: "Completed Jobs",
      value: completed,
      description: "Successfully completed",
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      label: "Total Earnings",
      value: `${earnings.toLocaleString()}`,
      description: "From completed jobs",
      accent: "bg-violet-500",
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-cyan-600">
              Technician Dashboard
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your services, bookings, and earnings from one place.
            </p>
          </div>

          <Link href="/dashboard/technician/bookings">
            <Button className="w-full bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 sm:w-auto">
              View Bookings
            </Button>
          </Link>
        </div>

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            Could not load your booking statistics: {error.message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="border-slate-200 bg-white shadow-sm"
                >
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="relative overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Accent line */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`}
                  />

                  <CardHeader className="pb-2 pl-6">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </CardTitle>

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}
                      >
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${stat.accent}`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pl-6">
                    <div className="text-2xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-900">
              Quick Actions
            </CardTitle>

            <p className="text-sm text-slate-500">
              Quickly access the most important areas of your dashboard.
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/dashboard/technician/services">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start border-slate-200 bg-white text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600">
                    S
                  </span>
                  My Services
                </Button>
              </Link>

              <Link href="/dashboard/technician/bookings">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                    B
                  </span>
                  My Bookings
                </Button>
              </Link>

              <Link href="/dashboard/technician/profile">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start border-slate-200 bg-white text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                    P
                  </span>
                  My Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Summary */}
        <div className="rounded-2xl border border-slate-200 bg-[#4F3B99] p-6 text-white shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-salate-300">
              Technician Workspace
            </p>

            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
              Keep your services and bookings organized.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Review incoming requests, manage your active jobs, update your
              services, and keep your technician profile up to date.
            </p>

            <div className="mt-5">
              <Link href="/dashboard/technician/bookings">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">
                  Manage Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

