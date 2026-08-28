"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center space-y-6">
      <XCircle className="mx-auto h-14 w-14 text-red-500" />
      <h1 className="text-xl font-semibold">Payment cancelled</h1>
      <p className="text-muted-foreground">
        No charge was made. You can try again from your bookings.
      </p>
      <Button className="w-full">
        <Link href="/dashboard/customer">Back to Dashboard</Link>
      </Button>
    </div>
  );
}