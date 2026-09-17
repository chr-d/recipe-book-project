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
  title: "mise - everything in its place",
  description: "Find and share delicious recipes.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "saffron" || stored === "cast-iron"
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "cast-iron" : "saffron");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={pinyonScript.variable} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧑‍🍳</text></svg>"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
