

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
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  service?: {
    title: string;
    price: number;
  };
  technician?: {
    name: string;
  };
  createdAt: string;
}

export interface CreateBookingPayload {
  serviceId: string;
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