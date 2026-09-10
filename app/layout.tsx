import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth/react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Recipe Book project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NeonAuthUIProvider authClient={authClient}>
          <header className="flex h-16 items-center justify-between border-b p-4">
            <nav></nav>
            <UserButton size="icon" />
          </header>
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
