"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MonthlyChartProps = {
  data: Array<{
    yearMonth: string;
    profit: number;
  }>;
};

function formatYen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月別収支グラフ</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            表示できるデータがありません。
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearMonth" />
              <YAxis tickFormatter={(v) => formatYen(v).replace("円", "")} />
              <Tooltip formatter={(value) => formatYen(Number(value))} />
              <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

