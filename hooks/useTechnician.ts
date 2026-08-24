import { useQuery } from "@tanstack/react-query";
import { getTechnicianAvailability, getTechnicianById } from "@/lib/api/technicians";
import { getServiceById } from "@/lib/api/services";


export function useTechnician(id: string) {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: async () => {
      const response = await getTechnicianById(id);
      return response.data;
    },
    enabled: !!id,
  });
}



export function useServiceDetail(id?: string | null) {
  return useQuery({
    queryKey: ["service", id],

    queryFn: async () => {
      const response = await getServiceById(id!);
      return response.data;
    },

    enabled: !!id,
  });
}

// export function useTechnicianAvailability(id: string) {
//   return useQuery({
//     queryKey: ["technician-availability", id],
//     queryFn: () => getTechnicianAvailability(id),
//     enabled: !!id,
//   });
// }

export function useTechnicianAvailability(id: string) {
  return useQuery({
    queryKey: ["technician-availability", id],
    queryFn: async () => {
      const response = await getTechnicianAvailability(id);
      return response.data;
    },
    enabled: !!id,
  });
}