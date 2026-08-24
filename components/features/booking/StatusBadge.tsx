import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/lib/api/bookings";

const statusStyles: Record<BookingStatus, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
  DECLINED: "bg-red-100 text-red-800 border-red-300",
  PAID: "bg-purple-100 text-purple-800 border-purple-300",
  IN_PROGRESS: "bg-green-100 text-green-800 border-green-300",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-300",
  CANCELLED: "bg-red-200 text-red-900 border-red-400",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
}