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
import { formatYen, profitClass } from "@/lib/pachinko/format";

type EntryTableProps = {
  entries: PachinkoEntry[];
  yearMonth: string;
  deleteAction: (formData: FormData) => void;
};

export function EntryTable({ entries, yearMonth, deleteAction }: EntryTableProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>履歴一覧</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-3 md:hidden">
          {entries.length === 0 ? (
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
              まだ登録がありません。
            </div>
          ) : (
            entries.map((entry) => {
              const profit = calcProfit(entry);
              return (
                <article key={entry.id} className="rounded-md border bg-background p-3">
                  <div className="overflow-x-auto">
                    <p className={`whitespace-nowrap text-sm ${profitClass(profit)}`}>
                      {entry.playedOn} / {entry.parlor} / {entry.machine} /{" "}
                      {profit >= 0 ? "+" : ""}
                      {formatYen(profit)}円
                    </p>
                  </div>
                  <form action={deleteAction} className="mt-3">
                    <input type="hidden" name="ym" value={yearMonth} />
                    <input type="hidden" name="entryId" value={entry.id} />
                    <Button variant="outline" size="sm" type="submit" className="w-full">
                      削除
                    </Button>
                  </form>
                </article>
              );
            })
          )}
        </div>

        <div className="hidden md:block">
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
        </div>
      </CardContent>
    </Card>
  );
}
