

"use client";

import {
  useMyAvailability,
  useSetAvailability,
  useRemoveAvailabilitySlot,
} from "@/hooks/useTechnicianDashboard";
import { WeeklyHours } from "@/lib/api/technician";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { X } from "lucide-react";

const DAYS: WeeklyHours["day"][] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

type DraftAvailability = {
  start: string;
  end: string;
};

export function AvailabilityForm() {
  const { data: availability, isLoading } = useMyAvailability();
  const setMutation = useSetAvailability();
  const removeMutation = useRemoveAvailabilitySlot();

  const [draft, setDraft] = useState<
    Partial<Record<WeeklyHours["day"], DraftAvailability>>
  >({});

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const byDay = new Map(availability?.map((a) => [a.day, a]));

  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const existing = byDay.get(day);
        const currentDraft = draft[day];

        return (
          <div
            key={day}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <span className="w-12 text-sm font-medium">{day}</span>

            {existing ? (
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {existing.start} – {existing.end}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove ${day} availability`}
                  onClick={() => removeMutation.mutate(day)}
                  disabled={removeMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="time"
                  className="w-28"
                  value={currentDraft?.start ?? ""}
                  onChange={(e) =>
                    setDraft((previous) => ({
                      ...previous,
                      [day]: {
                        start: e.target.value,
                        end: previous[day]?.end ?? "",
                      },
                    }))
                  }
                />

                <span className="text-muted-foreground">to</span>

                <Input
                  type="time"
                  className="w-28"
                  value={currentDraft?.end ?? ""}
                  onChange={(e) =>
                    setDraft((previous) => ({
                      ...previous,
                      [day]: {
                        start: previous[day]?.start ?? "",
                        end: e.target.value,
                      },
                    }))
                  }
                />

                <Button
                  size="sm"
                  disabled={
                    !currentDraft?.start ||
                    !currentDraft?.end ||
                    setMutation.isPending
                  }
                  onClick={() => {
                    if (!currentDraft?.start || !currentDraft?.end) {
                      return;
                    }

                    if (currentDraft.start >= currentDraft.end) {
                      return;
                    }

                    setMutation.mutate({
                      day,
                      start: currentDraft.start,
                      end: currentDraft.end,
                    });
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
