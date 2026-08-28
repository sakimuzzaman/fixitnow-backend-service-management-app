"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { createPayment, PaymentIntentData } from "@/lib/api/payment";

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = key ? loadStripe(key) : null;

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error: validationError } = await elements.submit();
    if (validationError) {
      setError(validationError.message ?? "Please check your payment details.");
      setSubmitting(false);
      return;
    }
    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}` },
      redirect: "if_required",
    });
    if (paymentError) {
      setError(paymentError.message ?? "Payment could not be confirmed.");
      setSubmitting(false);
      return;
    }
    if (paymentIntent) {
      router.replace(`/payment/success?bookingId=${bookingId}&payment_intent=${paymentIntent.id}`);
    }
  }

  return <form onSubmit={submit} className="space-y-5">
    <PaymentElement options={{ layout: "tabs" }} />
    {error && <p className="text-sm text-red-600">{error}</p>}
    <Button className="w-full" disabled={!stripe || !elements || submitting} type="submit">
      {submitting ? "Processing payment..." : "Pay securely"}
    </Button>
  </form>;
}

export default function PayBookingPage() {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentIntentData | null>(null);
  const createMutation = useMutation({
    mutationFn: () => createPayment(id),
    onSuccess: (response) => setPayment(response.data),
  });

  if (!stripePromise) return <div className="mx-auto max-w-md py-16 text-center">
    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
    <h1 className="text-xl font-semibold">Payment is unavailable</h1>
    <p className="mt-2 text-sm text-muted-foreground">Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your frontend environment.</p>
  </div>;

  return <div className="mx-auto max-w-md space-y-6 py-12">
    <div className="text-center"><h1 className="text-xl font-semibold">Secure payment</h1><p className="mt-2 text-sm text-muted-foreground">Pay for your accepted booking with Stripe.</p></div>
    {!payment ? <>
  
      {createMutation.isError && (
        <p className="text-sm text-red-600">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Unable to prepare payment."}
        </p>
      )}
      <Button className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
        {createMutation.isPending ? "Preparing secure checkout..." : "Continue to payment"}
      </Button>
    </> : <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret, appearance: { theme: "stripe" } }}>
      <CheckoutForm bookingId={payment.bookingId} />
    </Elements>}
  </div>;
}


