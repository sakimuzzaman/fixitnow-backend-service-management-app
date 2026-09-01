"use client";

import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";
import { StatusBadge } from "@/components/features/booking/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { usePaymentHistory } from "@/hooks/usePayments";
import {
  CalendarDays,
  
  ArrowRight,
  
  Clock3,
  FileText,
  Search,
  WalletCards,
} from "lucide-react";

const cancellableStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "PAID",
];

export default function CustomerDashboard() {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useMyBookings();

  const cancelMutation = useCancelBooking();

  const {
    data: payments,
    isLoading: paymentsLoading,
  } = usePaymentHistory();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            DASHBOARD HEADER
        ====================================================== */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <span className="text-sm font-medium text-blue-600">
                  Customer Dashboard
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Bookings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your service bookings and payment history.
              </p>
            </div>

            <Link href="/services">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Services
              </Button>
            </Link>
          </div>
        </div>

        {/* =====================================================
            BOOKINGS CARD
        ====================================================== */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)]">
          {/* Section Header */}
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Your Bookings
                  </h2>

                  <p className="text-xs text-slate-500">
                    Track and manage your service appointments
                  </p>
                </div>
              </div>

              {bookings && bookings.length > 0 && (
                <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
                  {bookings.length}{" "}
                  {bookings.length === 1 ? "booking" : "bookings"}
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="p-5 sm:p-7">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>

                <h3 className="font-semibold text-slate-900">
                  Unable to load bookings
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Could not load your bookings. Please try again.
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !isError &&
            bookings?.length === 0 && (
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <CalendarDays className="h-6 w-6 text-slate-400" />
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No bookings yet
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    You have not booked any services yet. Find a professional
                    and schedule your first service.
                  </p>

                  <Link href="/services" className="mt-5">
                    <Button className="rounded-xl bg-blue-600 shadow-sm hover:bg-blue-700">
                      Browse Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          {/* Bookings */}
          {!isLoading &&
            !isError &&
            bookings &&
            bookings.length > 0 && (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                        <TableHead className="h-12 pl-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Service
                        </TableHead>

                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date & Time
                        </TableHead>

                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </TableHead>

                        <TableHead className="pr-7 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="border-slate-100 transition hover:bg-blue-50/30"
                        >
                          <TableCell className="py-5 pl-7">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-60 truncate font-medium text-slate-900">
                                  {booking.service?.title ??
                                    booking.serviceId}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Booking #{booking.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock3 className="h-4 w-4 text-slate-400" />

                              {new Date(
                                booking.scheduledAt
                              ).toLocaleString()}
                            </div>
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={booking.status} />
                          </TableCell>

                          <TableCell className="pr-7">
                            <div className="flex justify-end gap-2">
                              {booking.status === "ACCEPTED" && (
                                <Button
                                  size="sm"
                                  className="rounded-lg bg-green-400 shadow-sm hover:bg-green-500"
                                 
                                >
                                  <Link
                                    href={`/dashboard/customer/bookings/${booking.id}/pay`}
                                  >
                                    
                                    Pay Now
                                  </Link>
                                </Button>
                              )}

                              {booking.status === "COMPLETED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-slate-200 bg-slate-300"
                                  
                                >
                                  <Link
                                    href={`/dashboard/customer/bookings/${booking.id}/review`}
                                  >
                                    {/* <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> */}
                                    Leave Review
                                  </Link>
                                </Button>
                              )}

                              {cancellableStatuses.includes(
                                booking.status
                              ) && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="rounded-lg"
                                  onClick={() =>
                                    cancelMutation.mutate(
                                      booking.id
                                    )
                                  }
                                  disabled={
                                    cancelMutation.isPending
                                  }
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile booking cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {booking.service?.title ??
                                booking.serviceId}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Booking #{booking.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                        {/* <Clock3 className="h-3.5 w-3.5" /> */}

                        {new Date(
                          booking.scheduledAt
                        ).toLocaleString()}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.status === "ACCEPTED" && (
                          <Button
                            size="sm"
                            className="rounded-lg bg-blue-600 hover:bg-blue-700"
                            
                          >
                            <Link
                              href={`/dashboard/customer/bookings/${booking.id}/pay`}
                            >
                              {/* <CreditCard className="mr-1.5 h-3.5 w-3.5" /> */}
                              Pay Now
                            </Link>
                          </Button>
                        )}

                        {booking.status === "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            
                          >
                            <Link
                              href={`/dashboard/customer/bookings/${booking.id}/review`}
                            >
                              Leave Review
                            </Link>
                          </Button>
                        )}

                        {cancellableStatuses.includes(
                          booking.status
                        ) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                            onClick={() =>
                              cancelMutation.mutate(
                                booking.id
                              )
                            }
                            disabled={
                              cancelMutation.isPending
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </section>

        {/* =====================================================
            PAYMENT HISTORY
        ====================================================== */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.18)]">
          {/* Payment Header */}
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <WalletCards className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Payment History
                  </h2>

                  <p className="text-xs text-slate-500">
                    Review your previous service payments
                  </p>
                </div>
              </div>

              {payments && payments.length > 0 && (
                <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:block">
                  {payments.length}{" "}
                  {payments.length === 1 ? "payment" : "payments"}
                </div>
              )}
            </div>
          </div>

          {/* Payment Loading */}
          {paymentsLoading && (
            <div className="p-5 sm:p-7">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          )}

          {/* Empty payments */}
          {!paymentsLoading && payments?.length === 0 && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  {/* <CreditCard className="h-6 w-6 text-slate-400" /> */}
                </div>

                <h3 className="font-semibold text-slate-900">
                  No payments yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed payments will appear here.
                </p>
              </div>
            </div>
          )}

          {/* Payment table */}
          {!paymentsLoading &&
            payments &&
            payments.length > 0 && (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                        <TableHead className="h-12 pl-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Service
                        </TableHead>

                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Technician
                        </TableHead>

                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Amount
                        </TableHead>

                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </TableHead>

                        <TableHead className="pr-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Paid
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="border-slate-100 transition hover:bg-emerald-50/20"
                        >
                          <TableCell className="py-5 pl-7">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <FileText className="h-4 w-4 text-slate-500" />
                              </div>

                              <span className="font-medium text-slate-900">
                                {payment.booking?.service?.title ??
                                  payment.bookingId}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-sm text-slate-600">
                            {payment.booking?.technicianProfile
                              ?.user?.name ?? "—"}
                          </TableCell>

                          <TableCell>
                            <span className="font-semibold text-slate-900">
                              USD {payment.amount.toFixed(2)}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              {payment.status}
                            </span>
                          </TableCell>

                          <TableCell className="pr-7 text-sm text-slate-500">
                            {payment.paidAt
                              ? new Date(
                                  payment.paidAt
                                ).toLocaleString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile */}
                <div className="space-y-3 p-4 md:hidden">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          {/* <CreditCard className="h-4 w-4" /> */}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">
                            {payment.booking?.service?.title ??
                              payment.bookingId}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Technician:{" "}
                            {payment.booking?.technicianProfile
                              ?.user?.name ?? "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            USD {payment.amount.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Status
                          </p>

                          <p className="mt-1 text-sm font-medium text-emerald-600">
                            {payment.status}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500">
                        Paid:{" "}
                        {payment.paidAt
                          ? new Date(
                              payment.paidAt
                            ).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </section>

        {/* Bottom trust message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          {/* <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> */}
          Your bookings and payment information are securely managed.
        </div>
      </div>
    </main>
  );
}

