
import { useQuery } from "@tanstack/react-query";
import {
   getServices,
  getServiceById,
  getCategories,
  getMyServices,
  ServiceFilters,
} from "@/lib/api/services";


export function useMyServices() {
  return useQuery({
    queryKey: ["my-services"],
    queryFn: async () => {
      const response = await getMyServices();

      return response.data;
    },
  });
}

export function useServices(filters: ServiceFilters) {
  return useQuery({
    queryKey: ["services", filters],

    queryFn: async () => {
      const response = await getServices(filters);

      return response.data;
    },
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["service", id],

    queryFn: async () => {
      const response = await getServiceById(id);

      return response.data;
    },

    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const response = await getCategories();

      return response.data;
    },

    staleTime: 5 * 60_000,
  });
}