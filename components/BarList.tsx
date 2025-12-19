export default function BarList({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">{title}</div>

      <ul className="mt-4 space-y-3">
        {items.map((i) => {
          const w = Math.round((i.value / max) * 100);
          return (
            <li key={i.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{i.label}</span>
                <span className="font-medium">{i.value.toLocaleString()}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-gray-800" style={{ width: `${w}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
