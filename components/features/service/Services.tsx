"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useServices, useCategories } from "@/hooks/useServices";
import { ServiceCard } from "@/components/features/service/ServiceCard";
import { ServiceCardSkeleton } from "@/components/features/service/ServiceCardSkeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "@/lib/api/services";


export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = {
    category: searchParams.get("category") || undefined,
    location: searchParams.get("location") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    rating: searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : undefined,
  };

  const [location, setLocation] = useState(filters.location ?? "");
  const [minPrice, setMinPrice] = useState(
    filters.minPrice?.toString() ?? ""
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice?.toString() ?? ""
  );

  // Keep local input values synchronized with URL params
  useEffect(() => {
    setLocation(filters.location ?? "");
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }, [
    filters.location,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const {
    data: services,
    isLoading,
    isError,
  } = useServices(filters);

  const { data: categories } = useCategories();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/services?${params.toString()}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-4">
      <aside className="space-y-4">
        <h2 className="font-semibold">Filters</h2>

        {/* Category */}
        <div>
          <label className="text-sm text-muted-foreground">
            Category
          </label>

          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) =>
              updateParam(
                "category",
                value === "all" ? "" : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All categories
              </SelectItem>

              {Array.isArray(categories) &&
                categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-muted-foreground">
            Location
          </label>

          <Input
            value={location}
            placeholder="e.g. Dhaka"
            onChange={(event) =>
              setLocation(event.target.value)
            }
            onBlur={(event) =>
              updateParam("location", event.target.value)
            }
          />
        </div>

        {/* Price */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">
              Min price
            </label>

            <Input
              type="number"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value)
              }
              onBlur={(event) =>
                updateParam("minPrice", event.target.value)
              }
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-muted-foreground">
              Max price
            </label>

            <Input
              type="number"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              onBlur={(event) =>
                updateParam("maxPrice", event.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Minimum rating</label>
          <Select value={filters.rating?.toString() ?? "all"} onValueChange={(value) => updateParam("rating", value === "all" ? "" : value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any rating</SelectItem>
              <SelectItem value="4">4★ and above</SelectItem>
              <SelectItem value="3">3★ and above</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </aside>

      {/* Services */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}

        {isError && (
          <p className="col-span-full text-red-500">
            Could not load services. Please try again.
          </p>
        )}

        {!isLoading && services?.length === 0 && (
          <p className="col-span-full text-muted-foreground">
            No services match your filters.
          </p>
        )}

        {services?.map((service: Service) => (
          <ServiceCard
            key={service.id}
            service={service}
            categories={categories}
          />
        ))}
      </section>
    </div>
  );
}
