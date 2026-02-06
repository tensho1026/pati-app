export function isYearMonth(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value);
}

export function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addMonths(yearMonth: string, delta: number): string {
  if (!isYearMonth(yearMonth)) throw new Error(`Invalid yearMonth: ${yearMonth}`);
  const [y, m] = yearMonth.split("-").map(Number);
  const base = new Date(y, m - 1, 1);
  base.setMonth(base.getMonth() + delta);
  return formatYearMonth(base);
}

export type CalendarCell = {
  date: string; // YYYY-MM-DD
  day: number;
};

export function getMonthGrid(yearMonth: string): Array<Array<CalendarCell | null>> {
  if (!isYearMonth(yearMonth)) throw new Error(`Invalid yearMonth: ${yearMonth}`);
  const [year, month] = yearMonth.split("-").map(Number);

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  // Monday-start (Mon=0 ... Sun=6)
  const startOffset = (firstDay.getDay() + 6) % 7;

  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells: Array<CalendarCell | null> = [];

  for (let i = 0; i < totalCells; i++) {
    const day = i - startOffset + 1;
    if (day < 1 || day > daysInMonth) {
      cells.push(null);
      continue;
    }
    const d = String(day).padStart(2, "0");
    const mm = String(month).padStart(2, "0");
    cells.push({ date: `${year}-${mm}-${d}`, day });
  }

  const weeks: Array<Array<CalendarCell | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

