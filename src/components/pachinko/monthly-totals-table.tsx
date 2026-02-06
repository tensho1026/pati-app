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

type MonthlyTotalsTableProps = {
  totals: MonthlyTotal[];
};

function formatYen(value: number) {
  return value.toLocaleString("ja-JP");
}

function profitClass(value: number) {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-muted-foreground";
}

export function MonthlyTotalsTable({ totals }: MonthlyTotalsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月別合計</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

