import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Pati App
      </Link>
      <nav className="flex items-center gap-2">
        <SignedIn>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Button asChild>
            <Link href="/sign-in">ログイン</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">新規登録</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

