import Header from "@/components/Header";
import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
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
          <Header />
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
            {children}
          </div>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
