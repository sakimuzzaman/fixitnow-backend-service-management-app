import { RoleGuard } from "@/components/shared/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allow="ADMIN">{children}</RoleGuard>;
}