"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AvailabilityDay } from "@/lib/api/technicians";

export function TimeSlotPicker({
  days,
  onSelect,
}: {
  days: AvailabilityDay[];
  onSelect: (date: string, time: string) => void;
}) {
  const [activeDate, setActiveDate] = useState(days[0]?.date);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);

  const activeDay = days.find((d) => d.date === activeDate);

  useEffect(() => {
    if (!activeDate || !days.some((day) => day.date === activeDate)) {
      setActiveDate(days[0]?.date);
      setSelected(null);
    }
  }, [activeDate, days]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.date}
            onClick={() => setActiveDate(d.date)}
            className={cn(
              "px-3 py-2 rounded-md border text-sm whitespace-nowrap",
              activeDate === d.date
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            )}
          >
            {new Date(`${d.date}T00:00:00+06:00`).toLocaleDateString(
               undefined,
                {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {activeDay?.slots.map((slot) => {
          const isSelected =
            selected?.date === activeDate && selected?.time === slot.time;
          return (
            <button
              key={slot.time}
              disabled={slot.isBooked}
              onClick={() => {
                setSelected({ date: activeDate!, time: slot.time });
                onSelect(activeDate!, slot.time);
              }}
              className={cn(
                "px-2 py-2 rounded-md border text-sm transition-colors",
                slot.isBooked &&
                  "bg-muted text-muted-foreground line-through cursor-not-allowed",
                !slot.isBooked && !isSelected && "hover:border-primary",
                isSelected && "bg-primary text-primary-foreground border-primary"
              )}
            >
              {slot.time}
            </button>
          );
        })}
        {activeDay?.slots.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            No slots for this day.
          </p>
        )}
      </div>
    </div>
  );
}
