import { Suspense } from "react";
import DetailClient from "@/components/DetailClient";

export default function DetailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border bg-white p-4 text-sm text-gray-600 shadow-sm">로딩 중…</div>}>
      <DetailClient />
    </Suspense>
  );
}
