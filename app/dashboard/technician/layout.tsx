import { RoleGuard } from "@/components/shared/RoleGuard";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allow="TECHNICIAN">{children}</RoleGuard>;
}