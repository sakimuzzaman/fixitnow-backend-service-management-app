import { AvailabilityForm } from "@/components/features/technician/AvailabilityForm";

export default function AvailabilityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Weekly Availability</h1>
      <p className="text-sm text-muted-foreground">
        Set the hours you are available each day. Customers can only book within these windows.
      </p>
      <AvailabilityForm />
    </div>
  );
}