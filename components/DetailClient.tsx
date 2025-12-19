"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCars } from "@/lib/useCars";

export default function DetailClient() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const { cars, error } = useCars();
  const car = cars?.find((c) => c.id === id);

  const row = (k: string, v: string) => (
    <div className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
      <span className="text-gray-600">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );

  if (error) {
    return <div className="rounded-2xl border bg-white p-4 text-sm text-red-600 shadow-sm">{error}</div>;
  }

  if (!cars) {
    return <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600 shadow-sm">데이터 로딩 중…</div>;
  }

  if (!id || !car) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">차량을 찾을 수 없습니다.</div>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          검색으로
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-2xl font-semibold tracking-tight">
          {car.brand} {car.model}
        </div>
        <div className="mt-2 text-sm text-gray-600">ID: {car.id}</div>
        <div className="mt-4 flex gap-3">
          <Link href="/" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
            검색으로
          </Link>
          <Link href="/dashboard" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
            대시보드
          </Link>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm">
        {row("연식", String(car.year))}
        {row("가격", car.price.toLocaleString())}
        {row("주행거리", car.mileage.toLocaleString())}
        {row("연료", car.fuelType)}
        {row("변속", car.transmission)}
      </div>
    </div>
  );
}
