import { useQuery } from "@tanstack/react-query";
import { getPaymentHistory } from "@/lib/api/payment";

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await getPaymentHistory()).data,
  });
}
