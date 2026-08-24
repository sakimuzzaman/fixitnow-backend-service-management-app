import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMyBookings,
  cancelBooking,
} from "@/lib/api/bookings";

import { toast } from "sonner";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await getMyBookings();

      return response.data;
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,

    onSuccess: () => {
      toast.success("Booking cancelled");

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.message || "Failed to cancel booking"
      );
    },
  });
}