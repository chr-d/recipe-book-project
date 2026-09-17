import Header from "@/components/Header";
import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";

import "./globals.css";

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon-script",
});

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Recipe Book project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={pinyonScript.variable} suppressHydrationWarning>
      <body>
        <NeonAuthUIProvider authClient={authClient}>
          <Header />
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
            {children}
          </div>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
