"use client";

import {
  useMyAvailability,
  useSetAvailability,
} from "@/hooks/useTechnicianDashboard";

import {
  DayOfWeek,
  WeeklyHours,
} from "@/lib/api/technician";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

type DraftAvailability = {
  start: string;
  end: string;
};

export function AvailabilityForm() {
  const { data: availability = [], isLoading } =
    useMyAvailability();

  const setMutation = useSetAvailability();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  function getAvailability(day: DayOfWeek) {
    return availability.find(
      (item: { dayOfWeek: string; }) => item.dayOfWeek === day
    );
  }

  function updateDay(
    day: DayOfWeek,
    startTime: string,
    endTime: string
  ) {
    const existingDay = getAvailability(day);

    const newSlot: WeeklyHours = {
      id: existingDay?.id,
      dayOfWeek: day,
      startTime,
      endTime,
      isAvailable: true,
    };

    const otherSlots = availability.filter(
      (item: { dayOfWeek: string; }) => item.dayOfWeek !== day
    );

    setMutation.mutate([
      ...otherSlots,
      newSlot,
    ]);
  }

  function removeDay(day: DayOfWeek) {
    const remainingSlots = availability.filter(
      (item: { dayOfWeek: string; }) => item.dayOfWeek !== day
    );

    setMutation.mutate(remainingSlots);
  }

  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const existing = getAvailability(day);

        return (
          <AvailabilityDayRow
            key={day}
            day={day}
            existing={existing}
            onSave={updateDay}
            onRemove={removeDay}
            isPending={setMutation.isPending}
          />
        );
      })}
    </div>
  );
}

function AvailabilityDayRow({
  day,
  existing,
  onSave,
  onRemove,
  isPending,
}: {
  day: DayOfWeek;
  existing?: WeeklyHours;
  onSave: (
    day: DayOfWeek,
    startTime: string,
    endTime: string
  ) => void;
  onRemove: (day: DayOfWeek) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <span className="w-28 text-sm font-medium">
        {day}
      </span>

      {existing ? (
        <>
          <span className="flex-1 text-sm text-muted-foreground">
            {existing.startTime} – {existing.endTime}
          </span>

          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => onRemove(day)}
          >
            Remove
          </Button>
        </>
      ) : (
        <AvailabilityInputs
          day={day}
          onSave={onSave}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function AvailabilityInputs({
  day,
  onSave,
  isPending,
}: {
  day: DayOfWeek;
  onSave: (
    day: DayOfWeek,
    startTime: string,
    endTime: string
  ) => void;
  isPending: boolean;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="flex flex-1 items-center gap-2">
      <Input
        type="time"
        className="w-28"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <span>to</span>

      <Input
        type="time"
        className="w-28"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <Button
        size="sm"
        disabled={
          !start ||
          !end ||
          start >= end ||
          isPending
        }
        onClick={() => onSave(day, start, end)}
      >
        Save
      </Button>
    </div>
  );
}