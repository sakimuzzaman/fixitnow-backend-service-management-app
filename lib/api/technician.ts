import { apiFetch, ApiResponse } from "./fetcher";
import { Booking, BookingStatus } from "./bookings";

export interface TechnicianProfile {
  id: string;
  name: string;
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  avatar?: string;
  hourlyRate?: number;
}

export interface WeeklyHours {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  start: string; // "09:00"
  end: string;   // "17:00"
}

export function getMyProfile() {
  return apiFetch<TechnicianProfile>("/technician/profile");
}

export function updateMyProfile(payload: Partial<TechnicianProfile>) {
  return apiFetch<TechnicianProfile>("/technician/profile", {
    method: "PATCH",
    body: payload,
  });
}

export function getMyAvailability() {
  return apiFetch<WeeklyHours[]>("/technician/availability");
}

export function setAvailability(payload: WeeklyHours) {
  return apiFetch<WeeklyHours>("/technician/availability", {
    method: "POST",
    body: payload,
  });
}

// ⚠️ assumed — confirm your delete route matches
export function removeAvailabilitySlot(day: string) {
  return apiFetch<void>(`/technician/availability/${day}`, { method: "DELETE" });
}

// export async function getMyIncomingBookings(): Promise<Booking[]> {
//   const response = await apiFetch<ApiResponse<Booking[]> | Booking[]>(
//     "/technician/bookings"
//   );

//   return Array.isArray(response) ? response : response.data;
// }
// export async function getMyIncomingBookings(): Promise<Booking[]> {
//   const response = await apiFetch<ApiResponse<Booking[]> | Booking[]>(
//     "/bookings/technician"
//   );

//   return Array.isArray(response) ? response : response.data;
// }

export async function getMyIncomingBookings(): Promise<Booking[]> {
  const response = await apiFetch<ApiResponse<Booking[]> | Booking[]>(
    "/bookings/technician/bookings"
  );

  return Array.isArray(response)
    ? response
    : response.data;
}

// export function updateBookingStatus(id: string, status: BookingStatus) {
//   return apiFetch<Booking>(`/technician/bookings/${id}`, {
//     method: "PATCH",
//     body: { status },
//   });
// }

// export function updateBookingStatus(id: string, status: BookingStatus) {
//   return apiFetch<Booking>(`/bookings/${id}/status`, {
//     method: "PATCH",
//     body: { status },
//   });
// }

export function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  return apiFetch<Booking>(
    `/bookings/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    }
  );
}