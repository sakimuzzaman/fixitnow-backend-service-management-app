"use client";

import { useIncomingBookings } from "@/hooks/useTechnicianDashboard";
import { StatusBadge } from "@/components/features/booking/StatusBadge";
import { BookingActions } from "@/components/features/technician/BookingActions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function TechnicianBookingsPage() {
  const { data: bookings, isLoading, isError, error } = useIncomingBookings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Booking Requests</h1>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {isError && (
        <p className="text-red-600">Could not load bookings: {error.message}</p>
      )}

      {bookings && bookings.length === 0 && (
        <p className="text-muted-foreground">No bookings yet.</p>
      )}

      {bookings && bookings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.service?.title ?? b.serviceId}</TableCell>
                <TableCell>{new Date(b.scheduledAt).toLocaleString()}</TableCell>
                <TableCell className="max-w-50 truncate">{b.address}</TableCell>
                <TableCell><StatusBadge status={b.status} /></TableCell>
                <TableCell><BookingActions booking={b} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
