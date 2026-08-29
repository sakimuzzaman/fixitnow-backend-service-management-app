"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createReview } from "@/lib/api/reviews";
import { StarRating } from "@/components/features/review/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeaveReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: () => createReview(id, { rating, comment }),
    onSuccess: () => {
      toast.success("Thanks for your feedback!");
      router.push("/dashboard/customer");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="mx-auto max-w-md py-16 space-y-6">
      <h1 className="text-xl font-semibold">Leave a review</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Rating</Label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the service?"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}