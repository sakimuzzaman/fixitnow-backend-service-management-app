import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-semibold">404 — Page not found</h2>
      <Button>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}