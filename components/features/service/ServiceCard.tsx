"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Service, Category } from "@/lib/api/services";

const fallbackImages = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
];

function getFallbackImage(serviceId: string) {
  const index = serviceId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return fallbackImages[index % fallbackImages.length];
}

export function ServiceCard({
  service,
  categories,
}: {
  service: Service;
  categories?: Category[];
}) {
  const categoryName = categories?.find(
    (category) => category.id === service.categoryId
  )?.name;

  const imageUrl =
    service.images?.[0] || getFallbackImage(service.id);

  return (
    <Link
      href={`/technicians/${service.technicianProfileId}?service=${service.id}`}
      className="block"
    >
      <Card className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
        {/* Service image */}
        <div className="relative h-44 w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-70" />

          {/* Category */}
          {categoryName && (
            <div className="absolute left-3 top-3">
              <Badge className="border-0 bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white">
                {categoryName}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="space-y-3 p-4">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-semibold tracking-tight">
              {service.title}
            </h3>

            <Badge
              variant="secondary"
              className="shrink-0 font-semibold"
            >
              ${service.price}
            </Badge>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {service.description}
          </p>

          {/* Location */}
          <div className="flex items-center justify-between gap-3 border-t pt-3 text-sm">
            <span className="truncate text-muted-foreground">
              {service.location}
            </span>

            {!categoryName && (
              <span className="text-xs font-medium text-primary">
                View service →
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

