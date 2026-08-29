"use client";

import { useIncomingBookings } from "@/hooks/useTechnicianDashboard";
import { StatusBadge } from "@/components/features/booking/StatusBadge";
import { BookingActions } from "@/components/features/technician/BookingActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianBookingsPage() {
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useIncomingBookings();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Failed to load bookings.
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="font-medium">
          No bookings yet
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          New customer booking requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="rounded-lg border p-5 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">
                {booking.service?.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                Customer:{" "}
                {booking.customer?.name ?? "Customer"}
              </p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          <div className="text-sm space-y-1">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                booking.scheduledAt
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {new Date(
                booking.scheduledAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {booking.address}
            </p>

            {booking.notes && (
              <p>
                <strong>Notes:</strong>{" "}
                {booking.notes}
              </p>
            )}
          </div>

          <BookingActions booking={booking} />
        </div>
      ))}
    </div>
  );
}



