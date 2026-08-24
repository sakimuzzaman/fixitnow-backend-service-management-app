import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service, Category } from "@/lib/api/services";

export function ServiceCard({
  service,
  categories,
}: {
  service: Service;
  categories?: Category[];
}) {
  const categoryName = categories?.find((c) => c.id === service.categoryId)?.name;

  return (
    // <Link href={`/technicians/${service.technicianId}?service=${service.id}`}>
    <Link
  href={`/technicians/${service.technicianProfileId}?service=${service.id}`}
>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-40 w-full bg-muted">
          <Image
            src={
              service.images?.[0] ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
            }
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{service.title}</h3>
            <Badge variant="secondary">${service.price}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span>{service.location}</span>
            {categoryName && <Badge variant="outline">{categoryName}</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
