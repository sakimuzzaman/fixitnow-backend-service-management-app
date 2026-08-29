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

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface WeeklyHours {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailabilityPayload {
  slots: WeeklyHours[];
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



export async function getMyAvailability(): Promise<WeeklyHours[]> {
  const response = await apiFetch<ApiResponse<WeeklyHours[]>>(
    "/technicians/availability"
  );

  return response.data;
}



export async function setAvailability(
  slots: WeeklyHours[]
): Promise<WeeklyHours[]> {
  const response = await apiFetch<ApiResponse<WeeklyHours[]>>(
    "/technicians/availability",
    {
      method: "PUT",
      body: {
        slots,
      },
    }
  );

  return response.data;
}




export async function getMyIncomingBookings(): Promise<Booking[]> {
  const response = await apiFetch<ApiResponse<Booking[]>>(
    "/bookings/technician/bookings"
  );

  return response.data;
}


export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const response = await apiFetch<ApiResponse<Booking>>(
    `/bookings/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    }
  );

  return response.data;
}