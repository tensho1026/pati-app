import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { calcProfit, type PachinkoEntry } from "@/lib/pachinko/entry-repository";

type EntryTableProps = {
  entries: PachinkoEntry[];
  yearMonth: string;
  deleteAction: (formData: FormData) => void;
};

function formatYen(value: number) {
  return value.toLocaleString("ja-JP");
}

function profitClass(value: number) {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-muted-foreground";
}

export function EntryTable({ entries, yearMonth, deleteAction }: EntryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>履歴一覧</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>店舗</TableHead>
              <TableHead>機種</TableHead>
              <TableHead className="text-right">収支</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  まだ登録がありません。
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const profit = calcProfit(entry);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.playedOn}</TableCell>
                    <TableCell>{entry.parlor}</TableCell>
                    <TableCell>{entry.machine}</TableCell>
                    <TableCell className={`text-right ${profitClass(profit)}`}>
                      {profit >= 0 ? "+" : ""}
                      {formatYen(profit)}円
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={deleteAction}>
                        <input type="hidden" name="ym" value={yearMonth} />
                        <input type="hidden" name="entryId" value={entry.id} />
                        <Button variant="outline" size="sm" type="submit">
                          削除
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

