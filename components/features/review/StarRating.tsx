"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && "cursor-pointer", "disabled:cursor-default")}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}