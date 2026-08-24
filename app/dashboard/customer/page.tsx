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
    error,
  } = useMyBookings();

  const cancelMutation = useCancelBooking();
  const { data: payments, isLoading: paymentsLoading } = usePaymentHistory();

  console.log("Customer bookings:", bookings);
  console.log("Booking error:", error);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">
        Your Bookings
      </h1>

      {/* Loading */}
      {isLoading && (
        <Skeleton className="h-64 w-full" />
      )}

      {/* Error */}
      {isError && (
        <p className="text-red-500">
          Could not load your bookings. Please try again.
        </p>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        bookings?.length === 0 && (
          <p className="text-muted-foreground">
            No bookings yet.{" "}
            <Link
              href="/services"
              className="underline"
            >
              Browse services
            </Link>
            .
          </p>
        )}

      {/* Bookings */}
      {!isLoading &&
        !isError &&
        bookings &&
        bookings.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    {booking.service?.title ??
                      booking.serviceId}
                  </TableCell>

                  <TableCell>
                    {new Date(
                      booking.scheduledAt
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={booking.status}
                    />
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    {booking.status === "ACCEPTED" && (
                      <Button size="sm">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      <section className="space-y-3 pt-4">
        <h2 className="text-xl font-semibold">Payment History</h2>
        {paymentsLoading && <Skeleton className="h-24 w-full" />}
        {!paymentsLoading && payments?.length === 0 && (
          <p className="text-muted-foreground">No payments yet.</p>
        )}
        {!paymentsLoading && payments && payments.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>Technician</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Paid</TableHead></TableRow></TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.booking?.service?.title ?? payment.bookingId}</TableCell>
                  <TableCell>{payment.booking?.technicianProfile?.user?.name ?? "—"}</TableCell>
                  <TableCell>USD {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
