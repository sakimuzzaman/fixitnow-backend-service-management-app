import ServicesPage from "@/components/features/service/Services";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading services...</div>}>
      <ServicesPage />
    </Suspense>
  );
}