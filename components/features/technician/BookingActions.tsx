"use client";

import { Button } from "@/components/ui/button";
import {
  Booking,
  BookingStatus,
} from "@/lib/api/bookings";
import { useUpdateBookingStatus } from "@/hooks/useTechnicianDashboard";

interface BookingActionsProps {
  booking: Booking;
}

export function BookingActions({
  booking,
}: BookingActionsProps) {
  const mutation = useUpdateBookingStatus();

  const handleStatusChange = (status: BookingStatus) => {
    mutation.mutate({
      id: booking.id,
      status,
    });
  };

  // REQUESTED → ACCEPTED / DECLINED
  if (booking.status === "REQUESTED") {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() =>
            handleStatusChange("ACCEPTED")
          }
          disabled={mutation.isPending}
        >
          Accept
        </Button>

        <Button
          variant="destructive"
          onClick={() =>
            handleStatusChange("DECLINED")
          }
          disabled={mutation.isPending}
        >
          Decline
        </Button>
      </div>
    );
  }

  // PAID → IN_PROGRESS
  if (booking.status === "PAID") {
    return (
      <Button
        className="bg-green-300"
        onClick={() =>
          handleStatusChange("IN_PROGRESS")
        }
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Starting..."
          : "Start Job"}
      </Button>
    );
  }

  // IN_PROGRESS → COMPLETED
  if (booking.status === "IN_PROGRESS") {
    return (
      <Button
        className="bg-green-300"
        onClick={() =>
          handleStatusChange("COMPLETED")
        }
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Completing..."
          : "Complete Job"}
      </Button>
    );
  }

  // ACCEPTED, DECLINED, CANCELLED, COMPLETED
  // have no technician action here.
  return null;
}