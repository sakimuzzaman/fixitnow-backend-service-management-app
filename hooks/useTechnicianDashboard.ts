import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  updateMyProfile,
  getMyAvailability,
  setAvailability,
  getMyIncomingBookings,
  updateBookingStatus,
  WeeklyHours,
} from "@/lib/api/technician";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { toast } from "sonner";

export function useMyProfile() {
  return useQuery({
    queryKey: ["technician-profile"],
    queryFn: getMyProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: () => {
      toast.success("Profile updated");

      queryClient.invalidateQueries({
        queryKey: ["technician-profile"],
      });
    },
  });
}

export function useMyAvailability() {
  return useQuery({
    queryKey: ["technician-availability-mine"],
    queryFn: getMyAvailability,
  });
}


export function useSetAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slots: WeeklyHours[]) => setAvailability(slots),

    onSuccess: () => {
      toast.success("Availability saved");

      queryClient.invalidateQueries({
        queryKey: ["technician-availability-mine"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save availability"
      );
    },
  });
}

// export function useRemoveAvailabilitySlot() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: removeAvailabilitySlot,

//     onSuccess: () => {
//       toast.success("Availability removed");

//       queryClient.invalidateQueries({
//         queryKey: ["technician-availability-mine"],
//       });
//     },
//   });
// }




export function useIncomingBookings() {
  return useQuery({
    queryKey: ["technician-bookings"],
    queryFn: getMyIncomingBookings,
  });
}



export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: BookingStatus;
    }) => updateBookingStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["technician-bookings"],
      });

      const previous = queryClient.getQueryData<Booking[]>([
        "technician-bookings",
      ]);

      queryClient.setQueryData<Booking[]>(
        ["technician-bookings"],
        (old) =>
          old?.map((booking) =>
            booking.id === id
              ? {
                  ...booking,
                  status,
                }
              : booking
          )
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["technician-bookings"],
          context.previous
        );
      }

      toast.error("Failed to update booking status");
    },

    onSuccess: () => {
      toast.success("Booking status updated");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["technician-bookings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });
}