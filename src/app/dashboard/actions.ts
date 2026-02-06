"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEntry, deleteEntry } from "@/lib/pachinko/entry-repository";
import { isISODate, isYearMonth } from "@/lib/date";

function requireUserId() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function parseYen(value: FormDataEntryValue | null): number {
  if (typeof value !== "string") return 0;
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.replace(/,/g, "");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return 0;
  return Math.trunc(n);
}

function getString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function createEntryAction(formData: FormData) {
  const userId = requireUserId();

  const playedOn = getString(formData.get("date"));
  const yearMonth = getString(formData.get("ym"));
  const memoRaw = getString(formData.get("memo"));
  const parlor = getString(formData.get("parlor")).trim();
  const machine = getString(formData.get("machine")).trim();

  if (!isISODate(playedOn)) throw new Error(`Invalid date: ${playedOn}`);
  const ym = isYearMonth(yearMonth) ? yearMonth : playedOn.slice(0, 7);
  if (!parlor) throw new Error("parlor is required");
  if (!machine) throw new Error("machine is required");

  const inAmount = parseYen(formData.get("inAmount"));
  const outAmount = parseYen(formData.get("outAmount"));
  const memo = memoRaw.trim() ? memoRaw.trim() : null;

  await createEntry(userId, {
    playedOn,
    parlor,
    machine,
    inAmount,
    outAmount,
    memo
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard?ym=${encodeURIComponent(ym)}`);
}

export async function deleteEntryAction(formData: FormData) {
  const userId = requireUserId();

  const yearMonth = getString(formData.get("ym"));
  const entryId = getString(formData.get("entryId"));
  if (!entryId) throw new Error("entryId is required");
  const ym = isYearMonth(yearMonth) ? yearMonth : "";

  await deleteEntry(userId, entryId);

  revalidatePath("/dashboard");
  redirect(ym ? `/dashboard?ym=${encodeURIComponent(ym)}` : "/dashboard");
}
