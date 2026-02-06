import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Pati App",
  description: "パチンコ収支を保存してカレンダーで確認するアプリ"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja" suppressHydrationWarning>
        <body>
          <div className="mx-auto max-w-6xl px-4">
            <SiteHeader />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
