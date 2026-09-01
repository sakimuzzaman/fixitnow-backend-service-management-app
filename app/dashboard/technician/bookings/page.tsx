"use client";

import { useIncomingBookings } from "@/hooks/useTechnicianDashboard";
import { StatusBadge } from "@/components/features/booking/StatusBadge";
import { BookingActions } from "@/components/features/technician/BookingActions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  BriefcaseBusiness,
  FileText,
  Inbox,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function TechnicianBookingsPage() {
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useIncomingBookings();

  /* =========================================================
     LOADING
  ========================================================== */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-52 rounded-xl" />
            <Skeleton className="h-4 w-80 rounded-lg" />
          </div>

          {/* Booking skeletons */}
          <div className="grid gap-5">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================== */
  if (isError) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 px-6 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>

              <h2 className="font-semibold text-slate-900">
                Unable to load bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Failed to load bookings. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     EMPTY STATE
  ========================================================== */
  if (bookings.length === 0) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Dashboard header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium text-blue-600">
                Technician Dashboard
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Incoming Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customer booking requests and appointments.
            </p>
          </div>

          {/* Empty card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                No bookings yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                New customer booking requests will appear here when customers
                book one of your services.
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                You are all caught up
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     BOOKINGS
  ========================================================== */
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium text-blue-600">
                Technician Dashboard
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Incoming Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review customer requests and manage your upcoming appointments.
            </p>
          </div>

          {/* Booking count */}
          <div className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Inbox className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total bookings
              </p>

              <p className="font-semibold text-slate-900">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOOKING CARDS
        ====================================================== */}
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-20px_rgba(15,23,42,0.22)]"
            >
              {/* Top accent */}
              <div className="h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

              <div className="p-5 sm:p-7">
                {/* =================================================
                    CARD HEADER
                ================================================== */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Service icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-600">
                        Service Request
                      </p>

                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {booking.service?.title}
                      </h2>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <UserRound className="h-3.5 w-3.5" />

                        <span>
                          Customer:{" "}
                          <span className="font-medium text-slate-700">
                            {booking.customer?.name ?? "Customer"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>

                {/* =================================================
                    APPOINTMENT DETAILS
                ================================================== */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {/* Date */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                      Appointment Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {new Date(
                        booking.scheduledAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                      Appointment Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {new Date(
                        booking.scheduledAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                      Service Address
                    </p>

                    <p
                      className="mt-1 truncate text-sm font-semibold text-slate-900"
                      title={booking.address}
                    >
                      {booking.address}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    NOTES
                ================================================== */}
                {booking.notes && (
                  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                        <FileText className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          Customer Notes
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {booking.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    ACTION AREA
                ================================================== */}
                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>
                      Booking information is securely managed
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <BookingActions booking={booking} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom helper */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Keep your booking status updated to provide the best customer
          experience.
        </div>
      </div>
    </main>
  );
}

