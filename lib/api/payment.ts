import { apiFetch, ApiResponse } from "./fetcher";

export interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
  paymentId: string;
  amount: number;
  currency: string;
  bookingId: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  provider: "STRIPE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string;
  createdAt: string;
  booking?: {
    service?: { title: string };
    technicianProfile?: { user?: { name: string } };
  };
}

export function createPayment(bookingId: string) {
  return apiFetch<ApiResponse<PaymentIntentData>>("/payments/create", {
    method: "POST",
    body: { bookingId },
  });
}

export function confirmPayment(paymentIntentId: string) {
  return apiFetch<ApiResponse<Payment>>("/payments/confirm", {
    method: "POST",
    body: { paymentIntentId },
  });
}

export function getPaymentHistory() {
  return apiFetch<ApiResponse<Payment[]>>("/payments");
}
