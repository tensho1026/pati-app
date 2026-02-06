import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatYen, profitClass } from "@/lib/pachinko/format";

type SummaryCardsProps = {
  allTime: { inAmount: number; outAmount: number; profit: number };
  month: { yearMonth: string; inAmount: number; outAmount: number; profit: number };
};

export function SummaryCards({ allTime, month }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>全期間の累計</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 p-4 pt-0 text-sm sm:p-6 sm:pt-0">
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>{month.yearMonth} の合計</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 p-4 pt-0 text-sm sm:p-6 sm:pt-0">
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
