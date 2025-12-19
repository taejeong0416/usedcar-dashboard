"use client";

import { useEffect, useState } from "react";
import type { Car } from "./cars";
import { loadCarsFromCsv } from "./cars";

export function useCars() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    // 프리렌더(서버) 단계에서는 window가 없으므로, 마운트 후에만 계산
    const seg = window.location.pathname.split("/").filter(Boolean)[0];
    setBasePath(seg ? `/${seg}` : "");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadCarsFromCsv(basePath);
        setCars(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
        setCars([]);
      }
    })();
  }, [basePath]);

  return { cars, error };
}
