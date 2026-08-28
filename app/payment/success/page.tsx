// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { CheckCircle2, XCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { confirmPayment } from "@/lib/api/payment";

// export default function PaymentSuccessPage() {
//   const params = useSearchParams();
//   const paymentIntentId = params.get("payment_intent");
//   const [state, setState] = useState<"confirming" | "confirmed" | "failed">("confirming");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!paymentIntentId) {
//       setState("failed");
//       setError("Missing payment confirmation details.");
//       return;
//     }
//     confirmPayment(paymentIntentId)
//       .then(() => setState("confirmed"))
//       .catch((reason: Error) => {
//         setState("failed");
//         setError(reason.message || "Payment confirmation failed.");
//       });
//   }, [paymentIntentId]);

//   return <div className="mx-auto max-w-md space-y-6 py-20 text-center">
//     {state === "confirming" && <p className="text-muted-foreground">Confirming your payment...</p>}
//     {state === "confirmed" && <><CheckCircle2 className="mx-auto h-14 w-14 text-green-500" /><h1 className="text-xl font-semibold">Payment successful</h1><p className="text-muted-foreground">Your booking is paid and your technician can now start the job.</p></>}
//     {state === "failed" && <><XCircle className="mx-auto h-14 w-14 text-red-500" /><h1 className="text-xl font-semibold">Payment was not confirmed</h1><p className="text-muted-foreground">{error}</p></>}
//     <Button  className="w-full"><Link href="/dashboard/customer">Go to Dashboard</Link></Button>
//   </div>;
// }




"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmPayment } from "@/lib/api/payment";

function PaymentSuccessContent() {
  const params = useSearchParams();

  const paymentIntentId = params.get("payment_intent");

  const [state, setState] = useState<
    "confirming" | "confirmed" | "failed"
  >("confirming");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentIntentId) {
      setState("failed");
      setError("Missing payment confirmation details.");
      return;
    }

    let cancelled = false;

    async function confirm() {
      try {
        await confirmPayment(paymentIntentId || "");

        if (!cancelled) {
          setState("confirmed");
        }
      } catch (reason: unknown) {
        if (!cancelled) {
          setState("failed");

          if (reason instanceof Error) {
            setError(
              reason.message || "Payment confirmation failed."
            );
          } else {
            setError("Payment confirmation failed.");
          }
        }
      }
    }

    confirm();

    return () => {
      cancelled = true;
    };
  }, [paymentIntentId]);

  return (
    <div className="mx-auto max-w-md space-y-6 py-20 text-center">
      {state === "confirming" && (
        <p className="text-muted-foreground">
          Confirming your payment...
        </p>
      )}

      {state === "confirmed" && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />

          <h1 className="text-xl font-semibold">
            Payment successful
          </h1>

          <p className="text-muted-foreground">
            Your booking is paid and your technician can now
            start the job.
          </p>
        </>
      )}

      {state === "failed" && (
        <>
          <XCircle className="mx-auto h-14 w-14 text-red-500" />

          <h1 className="text-xl font-semibold">
            Payment was not confirmed
          </h1>

          <p className="text-muted-foreground">
            {error}
          </p>
        </>
      )}

      <Button className="w-full">
        <Link href="/dashboard/customer">
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="text-muted-foreground">
            Loading payment confirmation...
          </p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}