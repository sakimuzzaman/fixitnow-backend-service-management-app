"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBooking } from "@/lib/api/bookings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  address: z.string().min(5, "Enter a full address"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewBookingPage() {
  const params = useSearchParams();
  const router = useRouter();

  const serviceId = params.get("serviceId")!;
  const technicianId = params.get("technicianId")!;
  const date = params.get("date")!; // "2026-08-20"
  const time = params.get("time")!; // "10:00"

  // const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
  console.log("========== FRONTEND BOOKING DEBUG ==========");
console.log("serviceId:", serviceId);
console.log("date:", date);
console.log("time:", time);
  const scheduledAt = new Date(
  `${date}T${time}:00+06:00`
).toISOString();

console.log("scheduledAt:", scheduledAt);
console.log("=============================================");


  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createBooking({ serviceId, technicianId, scheduledAt, ...values }),
    onSuccess: () => {
      toast.success("Booking requested! Waiting for technician confirmation.");
      router.push("/dashboard/customer");
    },
  });

  return (
    <div className="mx-auto max-w-md py-10 space-y-6">
      <h1 className="text-xl font-semibold">Confirm your booking</h1>
      <p className="text-sm text-muted-foreground">
        {new Date(scheduledAt).toLocaleString()}
      </p>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
        <div>
          <Label htmlFor="address">Service address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" {...register("notes")} placeholder="Describe the issue..." />
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Confirm Booking Request"}
        </Button>
      </form>
    </div>
  );
}