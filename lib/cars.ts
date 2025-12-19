export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === "\r") continue;

    if (ch === '"') {
      const next = text[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === ",") {
      row.push(cur);
      cur = "";
      continue;
    }

    if (!inQuotes && ch === "\n") {
      row.push(cur);
      rows.push(row.map((s) => s.trim()));
      row = [];
      cur = "";
      continue;
    }

    cur += ch;
  }

  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row.map((s) => s.trim()));
  }

  return rows.filter((r) => r.some((v) => v.length));
}

function toNumber(v: string): number {
  const cleaned = v.replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export async function loadCarsFromCsv(basePath = ""): Promise<Car[]> {
  const res = await fetch(`${basePath}/cars.csv`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cars.csv");
  const csv = await res.text();

  const rows = parseCsv(csv);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.toLowerCase());
  const idx = (name: string) => header.indexOf(name.toLowerCase());

  const iId = idx("id");
  const iBrand = idx("brand");
  const iModel = idx("model");
  const iYear = idx("year");
  const iPrice = idx("price");
  const iMileage = idx("mileage");
  const iFuel = idx("fueltype");
  const iTx = idx("transmission");

  return rows.slice(1).map((r, k) => ({
    id: (iId >= 0 ? r[iId] : String(k + 1)) || String(k + 1),
    brand: iBrand >= 0 ? (r[iBrand] || "Unknown") : "Unknown",
    model: iModel >= 0 ? (r[iModel] || "Unknown") : "Unknown",
    year: iYear >= 0 ? toNumber(r[iYear]) : 0,
    price: iPrice >= 0 ? toNumber(r[iPrice]) : 0,
    mileage: iMileage >= 0 ? toNumber(r[iMileage]) : 0,
    fuelType: iFuel >= 0 ? (r[iFuel] || "unknown") : "unknown",
    transmission: iTx >= 0 ? (r[iTx] || "unknown") : "unknown",
  }));
}

export function computeDashboard(cars: Car[]) {
  const n = cars.length;
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const fmtInt = (x: number) => Math.round(x).toLocaleString();

  const avgPrice = avg(cars.map((c) => c.price));
  const avgMileage = avg(cars.map((c) => c.mileage));

  const by = <K extends string>(keyFn: (c: Car) => K) => {
    const m = new Map<K, number>();
    for (const c of cars) m.set(keyFn(c), (m.get(keyFn(c)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  const topBrands = by((c) => c.brand).slice(0, 5);
  const fuelMix = by((c) => c.fuelType);

  const yearBins = [
    { label: "2014-", test: (y: number) => y <= 2014 },
    { label: "2015-2017", test: (y: number) => y >= 2015 && y <= 2017 },
    { label: "2018-2020", test: (y: number) => y >= 2018 && y <= 2020 },
    { label: "2021+", test: (y: number) => y >= 2021 },
  ].map((b) => ({
    label: b.label,
    count: cars.filter((c) => b.test(c.year)).length,
  }));

  return {
    n,
    avgPriceText: fmtInt(avgPrice),
    avgMileageText: fmtInt(avgMileage),
    topBrands,
    fuelMix,
    yearBins,
  };
}
