import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCardsProps = {
  allTime: { inAmount: number; outAmount: number; profit: number };
  month: { yearMonth: string; inAmount: number; outAmount: number; profit: number };
};

function formatYen(value: number) {
  return value.toLocaleString("ja-JP");
}

function profitClass(value: number) {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-muted-foreground";
}

export function SummaryCards({ allTime, month }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>全期間の累計</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">合計収支</span>
            <span className={profitClass(allTime.profit)}>
              {allTime.profit >= 0 ? "+" : ""}
              {formatYen(allTime.profit)}円
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>投資</span>
            <span>{formatYen(allTime.inAmount)}円</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>回収</span>
            <span>{formatYen(allTime.outAmount)}円</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{month.yearMonth} の合計</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">合計収支</span>
            <span className={profitClass(month.profit)}>
              {month.profit >= 0 ? "+" : ""}
              {formatYen(month.profit)}円
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>投資</span>
            <span>{formatYen(month.inAmount)}円</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>回収</span>
            <span>{formatYen(month.outAmount)}円</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

