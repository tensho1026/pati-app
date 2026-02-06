import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import type { MonthlyTotal } from "@/lib/pachinko/entry-repository";
import { formatYen, profitClass } from "@/lib/pachinko/format";

type MonthlyTotalsTableProps = {
  totals: MonthlyTotal[];
};

export function MonthlyTotalsTable({ totals }: MonthlyTotalsTableProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>月別合計</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-2 md:hidden">
          {totals.length === 0 ? (
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
              まだ登録がありません。
            </div>
          ) : (
            totals.map((total) => (
              <article key={total.yearMonth} className="rounded-md border bg-background p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{total.yearMonth}</span>
                  <span className={`text-sm ${profitClass(total.profit)}`}>
                    {total.profit >= 0 ? "+" : ""}
                    {formatYen(total.profit)}円
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>投資 {formatYen(total.inAmount)}円</span>
                  <span>回収 {formatYen(total.outAmount)}円</span>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>月</TableHead>
                <TableHead className="text-right">投資</TableHead>
                <TableHead className="text-right">回収</TableHead>
                <TableHead className="text-right">収支</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    まだ登録がありません。
                  </TableCell>
                </TableRow>
              ) : (
                totals.map((total) => (
                  <TableRow key={total.yearMonth}>
                    <TableCell className="font-medium">{total.yearMonth}</TableCell>
                    <TableCell className="text-right">
                      {formatYen(total.inAmount)}円
                    </TableCell>
                    <TableCell className="text-right">
                      {formatYen(total.outAmount)}円
                    </TableCell>
                    <TableCell className={`text-right ${profitClass(total.profit)}`}>
                      {total.profit >= 0 ? "+" : ""}
                      {formatYen(total.profit)}円
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
