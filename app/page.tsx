"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/features/service/ServiceCard";
import { ServiceCardSkeleton } from "@/components/features/service/ServiceCardSkeleton";
import { useCategories, useServices } from "@/hooks/useServices";

export default function Home() {
  const { data: services, isLoading, isError } = useServices({});
  const { data: categories } = useCategories();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20 lg:py-24">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            {/* Badge */}
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Trusted home services
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your trusted home
              <span className="block text-cyan-400">
                service platform
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Find qualified technicians, choose a convenient time, and
              track every job from booking to completion — all in one place.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full bg-cyan-500 px-7 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 sm:w-auto"
                
              >
                <Link href="/services">
                  Browse services
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-600 bg-transparent px-7 text-white hover:bg-slate-800 hover:text-white sm:w-auto"
                
              >
                <Link href="/auth/register">
                  Get started
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
              <span>✓ Verified technicians</span>
              <span>✓ Easy booking</span>
              <span>✓ Secure payments</span>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
                Explore our services
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Featured services
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Professional help for your everyday home needs.
              </p>
            </div>

            <Link
              className="w-fit text-sm font-semibold text-slate-700 transition-colors hover:text-cyan-600"
              href="/services"
            >
              View all →
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}

            {isError && (
              <div className="col-span-full rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-red-600">
                  Unable to load featured services.
                </p>

                <p className="mt-1 text-xs text-red-500">
                  Please try again later.
                </p>
              </div>
            )}

            {services?.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                categories={categories}
              />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 text-center sm:px-10 lg:flex-row lg:text-left">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Need help around your home?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Browse our available services and connect with a qualified
                technician who can get the job done.
              </p>
            </div>

            <Button
              className="shrink-0 bg-slate-900 px-6 text-white hover:bg-slate-800"
            >
              <Link href="/services">
                Find a technician
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

