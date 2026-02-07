import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { formatISODate, formatYearMonth, isYearMonth } from "@/lib/date";
import {
  getAllTimeTotals,
  listEntries,
  listMonthlyTotals
} from "@/lib/pachinko/entry-repository";

import { createEntryAction, deleteEntryAction } from "./actions";
import { EntryForm } from "@/components/pachinko/entry-form";
import { EntryTable } from "@/components/pachinko/entry-table";
import { SummaryCards } from "@/components/pachinko/summary-cards";
import { MonthlyTotalsTable } from "@/components/pachinko/monthly-totals-table";

const MonthlyChart = dynamic(
  () => import("@/components/pachinko/monthly-chart").then((mod) => mod.MonthlyChart),
  { ssr: false }
);

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams | undefined, key: string): string {
  const v = searchParams?.[key];
  return typeof v === "string" ? v : "";
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const now = new Date();
  const today = formatISODate(now);
  const fallbackYm = formatYearMonth(now);

  const ymRaw = getParam(searchParams, "ym");
  const yearMonth = isYearMonth(ymRaw) ? ymRaw : fallbackYm;

  const [entries, monthlyTotals, allTimeTotals] = await Promise.all([
    listEntries(userId),
    listMonthlyTotals(userId),
    getAllTimeTotals(userId)
  ]);

  const currentMonthTotals =
    monthlyTotals.find((row) => row.yearMonth === yearMonth) ?? {
      yearMonth,
      inAmount: 0,
      outAmount: 0,
      profit: 0
    };

  const chartData = monthlyTotals
    .slice()
    .reverse()
    .map((row) => ({ yearMonth: row.yearMonth, profit: row.profit }));

  const defaultDate = today.startsWith(yearMonth) ? today : `${yearMonth}-01`;

  return (
    <main className="grid gap-4 pb-8 sm:gap-6 sm:pb-10">
      <section className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {process.env.DATABASE_URL
                ? "DB保存モード"
                : "DB未接続のためメモリ保存（再起動で消えます）"}
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
            <span className="text-sm text-muted-foreground">対象月</span>
            <span className="rounded-md border px-3 py-1 text-sm">{yearMonth}</span>
          </div>
        </div>
      </section>

      <SummaryCards allTime={allTimeTotals} month={currentMonthTotals} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">収支入力</h2>
          <p className="text-sm text-muted-foreground">
            日付 / 店舗 / 機種 / 投資 / 回収を入力すると差額が自動計算されます。
          </p>
          <div className="mt-4">
            <EntryForm defaultDate={defaultDate} yearMonth={yearMonth} action={createEntryAction} />
          </div>
        </section>

        <MonthlyChart data={chartData} />
      </div>

      <EntryTable entries={entries} yearMonth={yearMonth} deleteAction={deleteEntryAction} />

      <MonthlyTotalsTable totals={monthlyTotals} />
    </main>
  );
}
