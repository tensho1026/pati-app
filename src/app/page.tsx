import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { userId } = auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="grid gap-6 py-8">
      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="grid gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Pati App</h1>
          <p className="text-muted-foreground">
            パチンコの収支を保存して、履歴・月別合計・グラフで見える化します。
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              ログイン
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              新規登録
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
