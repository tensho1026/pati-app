export function formatYen(value: number) {
  return value.toLocaleString("ja-JP");
}

export function profitClass(value: number) {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-muted-foreground";
}

