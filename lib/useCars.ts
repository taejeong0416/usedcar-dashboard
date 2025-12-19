"use client";

import { useEffect, useState } from "react";
import type { Car } from "./cars";
import { loadCarsFromCsv } from "./cars";

export function useCars() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [basePath, setBasePath] = useState<string | null>(null); // null로 시작

  useEffect(() => {
    const seg = window.location.pathname.split("/").filter(Boolean)[0];
    setBasePath(seg ? `/${seg}` : "");
  }, []);

  useEffect(() => {
    if (basePath === null) return; // basePath 확정 전엔 fetch 금지

    (async () => {
      try {
        const data = await loadCarsFromCsv(basePath);
        setCars(data);
        setError(null); // 성공하면 에러 제거
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
        setCars([]);
      }
    })();
  }, [basePath]);

  return { cars, error };
}
