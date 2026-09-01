"use client";

import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import Image from "next/image";

import {
  useTechnician,
  useTechnicianAvailability,
  useServiceDetail,
} from "@/hooks/useTechnician";

import { TimeSlotPicker } from "@/components/features/booking/TimeSlotPicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { toast } from "sonner";

export default function TechnicianProfilePage() {
  const { id } = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const router = useRouter();

  const user = useAuthStore((s) => s.user);

  const {
    data: technician,
    isLoading: loadingTech,
  } = useTechnician(id);

  const {
    data: service,
  } = useServiceDetail(serviceId);

  const [selectedSlot, setSelectedSlot] =
    useState<{
      date: string;
      time: string;
    } | null>(null);

  const { data: availability = [] } = useTechnicianAvailability(id);

  function handleBookNow() {
    if (!user) {
      toast.error("Please log in to book a service");

      router.push(
        `/auth/login?redirect=/technicians/${id}?service=${serviceId}`
      );

      return;
    }

    if (!selectedSlot || !serviceId) {
      toast.error(
        "Select a service and time slot first"
      );

      return;
    }

    router.push(
      `/dashboard/customer/bookings/new?serviceId=${serviceId}&technicianId=${id}&date=${selectedSlot.date}&time=${selectedSlot.time}`
    );

//     router.push(
//   `/dashboard/customer/bookings/new?serviceId=${serviceId}&date=${selectedSlot.date}&time=${selectedSlot.time}`
// );


  }

  if (loadingTech) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!technician) {
    return (
      <p className="p-8 text-muted-foreground">
        Technician not found.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">

      {/* Technician */}
      <div className="flex items-center gap-4">
        <Image
          src={
            technician.user.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          }
          alt={technician.user.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <h1 className="text-xl font-semibold">
            {technician.user.name}
          </h1>

          {technician.ratingAvg !== undefined && (
            <p>
              ⭐ {technician.ratingAvg.toFixed(1)}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {technician.bio && (
        <p className="text-muted-foreground">
          {technician.bio}
        </p>
      )}

      {technician.skills && technician.skills.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {technician.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {technician.reviews && technician.reviews.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Customer reviews</h2>
          <div className="space-y-2">
            {technician.reviews.map((review: { id: string; rating: number; comment?: string }) => (
              <div key={review.id} className="rounded-md border p-3 text-sm">
                <span>★ {review.rating}/5</span>{review.comment && <p className="mt-1 text-muted-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Service */}
      {service && (
        <div className="rounded-md border p-4">
          <p className="font-medium">
            {service.title}
          </p>

          <p className="text-sm text-muted-foreground">
            ৳{service.price} · {service.duration} min
          </p>
        </div>
      )}

      {/* Availability */}
      <div>
        <h2 className="font-semibold mb-3">
          Choose a time slot
        </h2>

        {availability.length > 0 ? (
          <TimeSlotPicker
            days={availability}
            onSelect={(date, time) =>
              setSelectedSlot({ date, time })
            }
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No availability posted yet.
          </p>
        )}
      </div>

      {/* Book */}
      <Button
        onClick={handleBookNow}
        disabled={!selectedSlot}
      >
        Book Now
      </Button>
    </div>
  );
}

