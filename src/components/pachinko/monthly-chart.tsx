"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatYen } from "@/lib/pachinko/format";

type MonthlyChartProps = {
  data: Array<{
    yearMonth: string;
    profit: number;
  }>;
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartWidth = useMemo(() => Math.max(320, data.length * 56), [data.length]);

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>月別収支グラフ</CardTitle>
      </CardHeader>
      <CardContent className="h-[230px] p-4 pt-0 sm:h-[260px] sm:p-6 sm:pt-0">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            表示できるデータがありません。
          </div>
        ) : (
          <div className="h-full overflow-x-auto">
            <BarChart
              data={data}
              width={chartWidth}
              height={230}
              margin={{ top: 8, right: 4, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearMonth" minTickGap={18} tickMargin={8} />
              <YAxis
                width={46}
                tickFormatter={(v) => formatYen(v).replace("円", "")}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => `${formatYen(Number(value))}円`} />
              <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
