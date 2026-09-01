// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { useCategories } from "@/hooks/useServices";
// import {
//   createService,
//   CreateServicePayload,
// } from "@/lib/api/services";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function NewServicePage() {
//   const router = useRouter();

//   const { data: categories, isLoading: categoriesLoading } =
//     useCategories();

//   const [form, setForm] = useState<CreateServicePayload>({
//     title: "",
//     description: "",
//     price: 0,
//     duration: 0,
//     location: "",
//     categoryId: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   function handleChange(
//     field: keyof CreateServicePayload,
//     value: string
//   ) {
//     setForm((prev) => ({
//       ...prev,
//       [field]:
//         field === "price" || field === "duration"
//           ? Number(value)
//           : value,
//     }));
//   }

//   async function handleSubmit(
//     event: React.FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     setError("");

//     if (!form.categoryId) {
//       setError("Please select a category.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       await createService(form);

//       router.push("/dashboard/technician/services");
//     } catch (error) {
//       console.error(error);

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to create service."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-2xl px-4 py-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">
//           Add New Service
//         </h1>

//         <p className="text-sm text-muted-foreground">
//           Create a service that customers can book.
//         </p>
//       </div>

//       <form
//         onSubmit={handleSubmit}
//         className="space-y-5"
//       >
//         {/* Title */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Service Title
//           </label>

//           <Input
//             value={form.title}
//             onChange={(e) =>
//               handleChange("title", e.target.value)
//             }
//             placeholder="e.g. AC Repair"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Description
//           </label>

//           <textarea
//             value={form.description}
//             onChange={(e) =>
//               handleChange(
//                 "description",
//                 e.target.value
//               )
//             }
//             placeholder="Describe your service..."
//             className="min-h-30 w-full rounded-md border bg-background p-3 text-sm"
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Category
//           </label>

//           <select
//             value={form.categoryId}
//             onChange={(e) =>
//               handleChange(
//                 "categoryId",
//                 e.target.value
//               )
//             }
//             className="w-full rounded-md border bg-background px-3 py-2 text-sm"
//             disabled={categoriesLoading}
//             required
//           >
//             <option value="">
//               Select a category
//             </option>

//             {Array.isArray(categories) &&
//               categories.map((category) => (
//                 <option
//                   key={category.id}
//                   value={category.id}
//                 >
//                   {category.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* Price */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Price (USD)
//           </label>

//           <Input
//             type="number"
//             min="0"
//             value={form.price || ""}
//             onChange={(e) =>
//               handleChange("price", e.target.value)
//             }
//             placeholder="800"
//             required
//           />
//         </div>

//         {/* Duration */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Duration (minutes)
//           </label>

//           <Input
//             type="number"
//             min="1"
//             value={form.duration || ""}
//             onChange={(e) =>
//               handleChange(
//                 "duration",
//                 e.target.value
//               )
//             }
//             placeholder="60"
//             required
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Location
//           </label>

//           <Input
//             value={form.location}
//             onChange={(e) =>
//               handleChange(
//                 "location",
//                 e.target.value
//               )
//             }
//             placeholder="e.g. Dhaka"
//           />
//         </div>

//         {/* Error */}
//         {error && (
//           <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </p>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <Button
//             type="button"
//             className="bg-gray-400"
//             variant="outline"
//             onClick={() => router.back()}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             className="bg-cyan-400"
//             disabled={isSubmitting}
//           >
//             {isSubmitting
//               ? "Creating..."
//               : "Create Service"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useServices";

import {
  createService,
  CreateServicePayload,
} from "@/lib/api/services";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Info,
  MapPin,
  Tags,
  WandSparkles,
} from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();

  const [form, setForm] = useState<CreateServicePayload>({
    title: "",
    description: "",
    price: 0,
    duration: 0,
    location: "",
    categoryId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof CreateServicePayload,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "duration"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createService(form);

      router.push("/dashboard/technician/services");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create service."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            BACK BUTTON
        ====================================================== */}
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </span>

          Back to services
        </button>

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <span className="text-sm font-semibold text-blue-600">
              Service Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Add New Service
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create a professional service that customers can discover and
            book from your technician profile.
          </p>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* ===================================================
              FORM CARD
          ==================================================== */}
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_50px_-25px_rgba(15,23,42,0.2)]">
            {/* Card header */}
            <div className="border-b border-slate-100 bg-linear-to-r from-white to-blue-50/40 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <WandSparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Service details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Provide the information customers need
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-5 sm:p-7"
            >
              {/* =================================================
                  SERVICE TITLE
              ================================================== */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Service Title
                </label>

                <div className="relative">
                  <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    value={form.title}
                    onChange={(e) =>
                      handleChange("title", e.target.value)
                    }
                    placeholder="e.g. AC Repair & Maintenance"
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Use a clear and professional name customers can easily
                  understand.
                </p>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Description
                </label>

                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe what customers can expect from this service..."
                    className="min-h-32.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Explain what the service includes and what customers will
                  receive.
                </p>
              </div>

              {/* =================================================
                  CATEGORY
              ================================================== */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Category
                </label>

                <div className="relative">
                  <Tags className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      handleChange(
                        "categoryId",
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={categoriesLoading}
                    required
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>

                  <svg
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* =================================================
                  PRICE + DURATION
              ================================================== */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Price */}
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Price (USD)
                  </label>

                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="number"
                      min="0"
                      value={form.price || ""}
                      onChange={(e) =>
                        handleChange(
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="800"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Duration (minutes)
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="number"
                      min="1"
                      value={form.duration || ""}
                      onChange={(e) =>
                        handleChange(
                          "duration",
                          e.target.value
                        )
                      }
                      placeholder="60"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  LOCATION
              ================================================== */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    value={form.location}
                    onChange={(e) =>
                      handleChange(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Dhaka"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Specify where you provide this service.
                </p>
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <Info className="h-4 w-4 text-red-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Unable to create service
                    </p>

                    <p className="mt-0.5 text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  ACTIONS
              ================================================== */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-slate-200 bg-white px-6 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-blue-600 px-7 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Create Service
                    </>
                  )}
                </Button>
              </div>
            </form>
          </section>

          {/* ===================================================
              RIGHT INFORMATION PANEL
          ==================================================== */}
          <aside className="space-y-5">
            {/* Tips */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Info className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Service tips
                  </h2>

                  <p className="text-xs text-slate-500">
                    Make your service stand out
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Use a clear service title",
                  "Describe exactly what is included",
                  "Set an accurate service duration",
                  "Keep your pricing competitive",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                    <p className="text-sm leading-5 text-slate-600">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview/info */}
            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-[0_16px_50px_-20px_rgba(37,99,235,0.45)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                Grow your services
              </h2>

              <p className="mt-2 text-sm leading-5 text-blue-100">
                A complete and professional service listing helps customers
                understand your offering and makes booking easier.
              </p>

              <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />

                  <div>
                    <p className="text-sm font-semibold">
                      Ready to publish
                    </p>

                    <p className="mt-0.5 text-xs text-blue-100">
                      Your service will be available to customers after
                      creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small trust/info card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Professional listing
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Keep your information accurate
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

