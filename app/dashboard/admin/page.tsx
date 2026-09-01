"use client";

import {
  useAllUsers,
  useAllBookingsAdmin,
} from "@/hooks/useAdmin";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const {
    data: users,
    isLoading: loadingUsers,
  } = useAllUsers();

  const {
    data: bookings,
    isLoading: loadingBookings,
  } = useAllBookingsAdmin();

  const isLoading = loadingUsers || loadingBookings;

  const totalUsers = users?.length ?? 0;

  const totalTechnicians =
    users?.filter(
      (u: { role: string }) => u.role === "TECHNICIAN"
    ).length ?? 0;

  const activeBookings =
    bookings?.filter(
      (b: { status: string }) =>
        ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)
    ).length ?? 0;

  const totalRevenue =
    bookings
      ?.filter((booking) =>
        ["PAID", "IN_PROGRESS", "COMPLETED"].includes(
          booking.status
        )
      )
      .reduce(
        (sum, booking) =>
          sum + (booking.service?.price ?? 0),
        0
      ) ?? 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      description: "Registered platform users",
      accent: "bg-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      label: "Technicians",
      value: totalTechnicians,
      description: "Service professionals",
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-50",
    },
    {
      label: "Active Bookings",
      value: activeBookings,
      description: "Currently active jobs",
      accent: "bg-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      label: "Total Revenue",
      value: `${totalRevenue.toLocaleString()}`,
      description: "From active & completed jobs",
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Platform Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor users, technicians, bookings, and platform
            revenue from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
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
                  {/* Accent */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`}
                  />

                  <CardHeader className="pb-2 pl-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </CardTitle>

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${stat.accent}`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pl-6">
                    <p className="text-2xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Admin Summary */}
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-900">
              Platform Summary
            </CardTitle>

            <p className="text-sm text-slate-500">
              A quick snapshot of your FixItNow marketplace.
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Users */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Users
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {isLoading ? "—" : totalUsers}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Total registered accounts
                </p>
              </div>

              {/* Technicians */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Technicians
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {isLoading ? "—" : totalTechnicians}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Professionals providing services
                </p>
              </div>

              {/* Revenue */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Revenue
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {isLoading
                    ? "—"
                    : `৳${totalRevenue.toLocaleString()}`}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Platform booking revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA / Status */}
        <div className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan-300">
              Admin Workspace
            </p>

            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
              Keep the FixItNow platform running smoothly.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Monitor platform activity, manage users and
              technicians, and keep track of bookings and revenue
              from your administration workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

