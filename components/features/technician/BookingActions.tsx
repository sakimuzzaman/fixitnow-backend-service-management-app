"use client";

import { Button } from "@/components/ui/button";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { useUpdateBookingStatus } from "@/hooks/useTechnicianDashboard";

const nextActions: Partial<Record<BookingStatus, { label: string; next: BookingStatus; variant?: "default" | "destructive" | "outline" }[]>> = {
  REQUESTED: [
    { label: "Accept", next: "ACCEPTED" },
    { label: "Decline", next: "DECLINED", variant: "destructive" },
  ],
  PAID: [{ label: "Start Job", next: "IN_PROGRESS" }],
  IN_PROGRESS: [{ label: "Mark Completed", next: "COMPLETED" }],
};

export function BookingActions({ booking }: { booking: Booking }) {
  const mutation = useUpdateBookingStatus();
  const actions = nextActions[booking.status];

  if (!actions) return <span className="text-sm text-muted-foreground">—</span>;

  return (
    <div className="flex gap-2 justify-end">
      {actions.map((action) => (
        <Button
          key={action.next}
          size="sm"
          variant={action.variant ?? "default"}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ id: booking.id, status: action.next })}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}