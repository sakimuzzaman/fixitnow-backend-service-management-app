

import { apiFetch, ApiResponse } from "./fetcher";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  customerId?: string;
  technicianProfileId: string;
  serviceId: string;
  technicianId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  totalAmount?: number;
  service?: {
    title: string;
    price: number;
    duration?: number;
  };
  technician?: {
    name: string;
  };

  technicianProfile?: {
    user?: {
      name: string;
      email?: string;
      avatar?: string;
    };
  };

  customer?: {
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
  };

  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  serviceId: string;
  technicianId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
}

export function createBooking(payload: CreateBookingPayload) {
  return apiFetch<ApiResponse<Booking>>("/bookings", {
    method: "POST",
    body: payload,
  });
}

export function getMyBookings() {
  return apiFetch<ApiResponse<Booking[]>>("/bookings");
}

export function getTechnicianBookings() {
  return apiFetch<ApiResponse<Booking[]>>(
    "/bookings/technician/bookings"
  );
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  return apiFetch<ApiResponse<Booking>>(
    `/bookings/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    }
  );
}

export function getBookingById(id: string) {
  return apiFetch<ApiResponse<Booking>>(`/bookings/${id}`);
}

export function cancelBooking(id: string) {
  return apiFetch<ApiResponse<Booking>>(
    `/bookings/${id}/cancel`,
    {
      method: "PATCH",
    }
  );
}