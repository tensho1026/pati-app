import "server-only";

import { prisma } from "@/lib/prisma";

export type PachinkoEntry = {
  id: string;
  userId: string;
  playedOn: string; // YYYY-MM-DD
  yearMonth: string; // YYYY-MM
  parlor: string;
  machine: string;
  inAmount: number;
  outAmount: number;
  memo: string | null;
  createdAt: Date;
};

export type PachinkoEntryInput = {
  playedOn: string;
  parlor: string;
  machine: string;
  inAmount: number;
  outAmount: number;
  memo?: string | null;
};

type Store = Map<string, PachinkoEntry[]>;

const globalForStore = globalThis as unknown as {
  pachinkoEntryStore?: Store;
};

const pachinkoEntryStore: Store =
  globalForStore.pachinkoEntryStore ?? new Map<string, PachinkoEntry[]>();

if (process.env.NODE_ENV !== "production") {
  globalForStore.pachinkoEntryStore = pachinkoEntryStore;
}

function getUserEntries(userId: string) {
  const existing = pachinkoEntryStore.get(userId);
  if (existing) return existing;
  const created: PachinkoEntry[] = [];
  pachinkoEntryStore.set(userId, created);
  return created;
}

function deriveYearMonth(playedOn: string) {
  return playedOn.slice(0, 7);
}

export function calcProfit(entry: Pick<PachinkoEntry, "inAmount" | "outAmount">) {
  return entry.outAmount - entry.inAmount;
}

export async function createEntry(
  userId: string,
  input: PachinkoEntryInput
): Promise<PachinkoEntry> {
  const yearMonth = deriveYearMonth(input.playedOn);

  if (prisma) {
    const saved = await prisma.pachinkoEntry.create({
      data: {
        userId,
        playedOn: input.playedOn,
        yearMonth,
        parlor: input.parlor,
        machine: input.machine,
        inAmount: input.inAmount,
        outAmount: input.outAmount,
        memo: input.memo ?? null
      }
    });
    return {
      id: saved.id,
      userId: saved.userId,
      playedOn: saved.playedOn,
      yearMonth: saved.yearMonth,
      parlor: saved.parlor,
      machine: saved.machine,
      inAmount: saved.inAmount,
      outAmount: saved.outAmount,
      memo: saved.memo ?? null,
      createdAt: saved.createdAt
    };
  }

  const entry: PachinkoEntry = {
    id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    playedOn: input.playedOn,
    yearMonth,
    parlor: input.parlor,
    machine: input.machine,
    inAmount: input.inAmount,
    outAmount: input.outAmount,
    memo: input.memo ?? null,
    createdAt: new Date()
  };
  getUserEntries(userId).unshift(entry);
  return entry;
}

export async function deleteEntry(userId: string, id: string) {
  if (prisma) {
    await prisma.pachinkoEntry.deleteMany({ where: { id, userId } });
    return;
  }

  const entries = getUserEntries(userId);
  const idx = entries.findIndex((e) => e.id === id);
  if (idx >= 0) entries.splice(idx, 1);
}

export async function listEntries(userId: string): Promise<PachinkoEntry[]> {
  if (prisma) {
    const rows = await prisma.pachinkoEntry.findMany({
      where: { userId },
      orderBy: [{ playedOn: "desc" }, { createdAt: "desc" }]
    });
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      playedOn: r.playedOn,
      yearMonth: r.yearMonth,
      parlor: r.parlor,
      machine: r.machine,
      inAmount: r.inAmount,
      outAmount: r.outAmount,
      memo: r.memo ?? null,
      createdAt: r.createdAt
    }));
  }

  const entries = getUserEntries(userId);
  return [...entries].sort((a, b) => {
    if (a.playedOn === b.playedOn) return b.createdAt.getTime() - a.createdAt.getTime();
    return b.playedOn.localeCompare(a.playedOn);
  });
}

export async function listEntriesByMonth(
  userId: string,
  yearMonth: string
): Promise<PachinkoEntry[]> {
  if (prisma) {
    const rows = await prisma.pachinkoEntry.findMany({
      where: { userId, yearMonth },
      orderBy: [{ playedOn: "desc" }, { createdAt: "desc" }]
    });
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      playedOn: r.playedOn,
      yearMonth: r.yearMonth,
      parlor: r.parlor,
      machine: r.machine,
      inAmount: r.inAmount,
      outAmount: r.outAmount,
      memo: r.memo ?? null,
      createdAt: r.createdAt
    }));
  }

  return (await listEntries(userId)).filter((e) => e.yearMonth === yearMonth);
}

export type MonthlyTotal = {
  yearMonth: string;
  inAmount: number;
  outAmount: number;
  profit: number;
};

export async function listMonthlyTotals(userId: string): Promise<MonthlyTotal[]> {
  if (prisma) {
    const rows = await prisma.pachinkoEntry.groupBy({
      by: ["yearMonth"],
      where: { userId },
      _sum: { inAmount: true, outAmount: true },
      orderBy: { yearMonth: "desc" }
    });
    return rows.map((row) => {
      const inAmount = row._sum.inAmount ?? 0;
      const outAmount = row._sum.outAmount ?? 0;
      return {
        yearMonth: row.yearMonth,
        inAmount,
        outAmount,
        profit: outAmount - inAmount
      };
    });
  }

  const map = new Map<string, { inAmount: number; outAmount: number }>();
  for (const entry of await listEntries(userId)) {
    const prev = map.get(entry.yearMonth) ?? { inAmount: 0, outAmount: 0 };
    prev.inAmount += entry.inAmount;
    prev.outAmount += entry.outAmount;
    map.set(entry.yearMonth, prev);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([yearMonth, sums]) => ({
      yearMonth,
      inAmount: sums.inAmount,
      outAmount: sums.outAmount,
      profit: sums.outAmount - sums.inAmount
    }));
}

export async function getAllTimeTotals(userId: string) {
  if (prisma) {
    const result = await prisma.pachinkoEntry.aggregate({
      where: { userId },
      _sum: { inAmount: true, outAmount: true }
    });
    const inAmount = result._sum.inAmount ?? 0;
    const outAmount = result._sum.outAmount ?? 0;
    return { inAmount, outAmount, profit: outAmount - inAmount };
  }

  const entries = await listEntries(userId);
  const inAmount = entries.reduce((sum, e) => sum + e.inAmount, 0);
  const outAmount = entries.reduce((sum, e) => sum + e.outAmount, 0);
  return { inAmount, outAmount, profit: outAmount - inAmount };
}

