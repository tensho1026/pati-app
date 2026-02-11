"use client";

import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatYen, profitClass } from "@/lib/pachinko/format";

type EntryFormProps = {
  defaultDate: string;
  yearMonth: string;
  action: (formData: FormData) => void | Promise<void>;
};

function parseNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function EntryForm({ defaultDate, yearMonth, action }: EntryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [inAmount, setInAmount] = useState("");
  const [outAmount, setOutAmount] = useState("");

  const profit = useMemo(() => {
    return parseNumber(outAmount) - parseNumber(inAmount);
  }, [inAmount, outAmount]);

  async function submitAction(formData: FormData) {
    formRef.current?.reset();
    setInAmount("");
    setOutAmount("");
    await action(formData);
  }

  return (
    <form
      ref={formRef}
      className="grid gap-4 rounded-lg border bg-muted/20 p-4 sm:p-5"
      action={submitAction}
      autoComplete="off"
    >
      <input type="hidden" name="ym" value={yearMonth} />

      <div className="grid gap-2">
        <Label htmlFor="date">日付</Label>
        <Input id="date" name="date" type="date" defaultValue={defaultDate} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="parlor">店舗名</Label>
        <Input id="parlor" name="parlor" placeholder="例: ○○店" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="machine">機種名</Label>
        <Input id="machine" name="machine" placeholder="例: ○○" required />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="inAmount">投資額（円）</Label>
          <Input
            id="inAmount"
            name="inAmount"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={inAmount}
            onChange={(event) => setInAmount(event.target.value)}
            placeholder="例: 20000"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="outAmount">回収額（円）</Label>
          <Input
            id="outAmount"
            name="outAmount"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={outAmount}
            onChange={(event) => setOutAmount(event.target.value)}
            placeholder="例: 25000"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="memo">メモ（任意）</Label>
        <Textarea id="memo" name="memo" placeholder="台番号 / 店 / メモなど" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          差額:{" "}
          <span className={profitClass(profit)}>
            {profit >= 0 ? "+" : ""}
            {formatYen(profit)}円
          </span>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          保存
        </Button>
      </div>
    </form>
  );
}
