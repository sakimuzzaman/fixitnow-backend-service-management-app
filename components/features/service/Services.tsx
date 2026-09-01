"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  Sparkles,
  MapPin,
  DollarSign,
  Star,
  X,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";

import { Service } from "@/lib/api/services";

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------------------------------------------------------------- */
  /* URL filters                                                             */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* Local input state                                                       */
  /* ---------------------------------------------------------------------- */

  const [location, setLocation] = useState(filters.location ?? "");

  const [minPrice, setMinPrice] = useState(
    filters.minPrice?.toString() ?? ""
  );

  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice?.toString() ?? ""
  );

  /* Keep inputs synchronized with URL */
  useEffect(() => {
    setLocation(filters.location ?? "");
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }, [
    filters.location,
    filters.minPrice,
    filters.maxPrice,
  ]);

  /* ---------------------------------------------------------------------- */
  /* API                                                                     */
  /* ---------------------------------------------------------------------- */

  const {
    data: services,
    isLoading,
    isError,
  } = useServices(filters);

  const { data: categories } = useCategories();

  /* ---------------------------------------------------------------------- */
  /* Helpers                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateParam(
    key: string,
    value: string | null
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/services?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/services");
  }

  const activeFilterCount = [
    filters.category,
    filters.location,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
  ].filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  ).length;

  const selectedCategory = categories?.find(
    (category) => category.id === filters.category
  );

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* ------------------------------------------------------------------ */}
      {/* Decorative background                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-0 size-112 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 size-96 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Hero / Page heading                                               */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-cyan-500/10 via-indigo-900 to-cyan-500/10 px-6 py-8 text-white shadow-xl shadow-indigo-200/50 sm:px-8 lg:px-10">
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-28 size-96 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Sparkles className="size-4" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                FixItNow Marketplace
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find the right service
              <span className="block text-blue-100">
                for your next job.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Browse trusted technicians and find professional
              services that fit your needs, location, and budget.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* ============================================================ */}
          {/* Filters                                                       */}
          {/* ============================================================ */}

          <aside className="h-fit rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-200/50 backdrop-blur-xl lg:sticky lg:top-6">
            {/* Filter header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <SlidersHorizontal className="size-4" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Filters
                  </h2>

                  <p className="text-xs text-slate-400">
                    Refine your search
                  </p>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="my-5 h-px bg-slate-100" />

            <div className="space-y-5">
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Search className="size-3.5 text-blue-500" />
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
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all" className="bg-slate-200">
                      All categories
                    </SelectItem>

                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="bg-slate-200"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin className="size-3.5 text-emerald-500" />
                  Location
                </label>

                <Input
                  value={location}
                  placeholder="e.g. Dhaka"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none"
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  onBlur={(event) =>
                    updateParam(
                      "location",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <DollarSign className="size-3.5 text-violet-500" />
                  Price range
                </label>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={minPrice}
                    placeholder="Min"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none"
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                    onBlur={(event) =>
                      updateParam(
                        "minPrice",
                        event.target.value
                      )
                    }
                  />

                  <Input
                    type="number"
                    value={maxPrice}
                    placeholder="Max"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none"
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    onBlur={(event) =>
                      updateParam(
                        "maxPrice",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  Minimum rating
                </label>

                <Select
                  value={
                    filters.rating?.toString() ?? "all"
                  }
                  onValueChange={(value) =>
                    updateParam(
                      "rating",
                      value === "all" ? "" : value
                    )
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all" className="bg-slate-200">
                      Any rating
                    </SelectItem>

                    <SelectItem value="4" className="bg-slate-200">
                      4★ and above
                    </SelectItem>

                    <SelectItem value="3" className="bg-slate-200">
                      3★ and above
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-xs text-slate-500 hover:bg-red-50 hover:text-red-600"
                  onClick={clearFilters}
                >
                  <X className="mr-1.5 size-3.5" />
                  Clear all filters
                </Button>
              )}
            </div>
          </aside>

          {/* ============================================================ */}
          {/* Services                                                      */}
          {/* ============================================================ */}

          <section className="min-w-0">
            {/* Services heading */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Available services
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Explore services
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isLoading
                    ? "Finding services..."
                    : `${services?.length ?? 0} services available`}
                </p>
              </div>

              {/* Active filters */}
              {(selectedCategory ||
                filters.location ||
                filters.rating) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {selectedCategory.name}
                    </span>
                  )}

                  {filters.location && (
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                      {filters.location}
                    </span>
                  )}

                  {filters.rating && (
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                      {filters.rating}★+
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <ServiceCardSkeleton key={index} />
                  )
                )}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="flex min-h-90 items-center justify-center rounded-3xl border border-red-200/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur">
                <div>
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Search className="size-5" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    Could not load services
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Please try again or adjust your filters.
                  </p>
                </div>
              </div>
            )}

            {/* Empty */}
            {!isLoading &&
              !isError &&
              services?.length === 0 && (
                <div className="flex min-h-90 items-center justify-center rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur">
                  <div className="max-w-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-indigo-100 text-blue-600">
                      <Search className="size-6" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      No services found
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      We could not find any services matching
                      your current filters.
                    </p>

                    <Button
                      variant="outline"
                      className="mt-5 rounded-xl"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}

            {/* Services */}
            {!isLoading &&
              !isError &&
              services &&
              services.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {services.map((service: Service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      categories={categories}
                    />
                  ))}
                </div>
              )}
          </section>
        </div>
      </div>
    </main>
  );
}

