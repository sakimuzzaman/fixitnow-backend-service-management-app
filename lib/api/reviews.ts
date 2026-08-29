import { apiFetch } from "./fetcher";

export interface CreateReviewPayload {
  rating: number; // 1-5
  comment: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function createReview(bookingId: string, payload: CreateReviewPayload) {
  return apiFetch<Review>(`/bookings/${bookingId}/reviews`, {
    method: "POST",
    body: payload,
  });
}