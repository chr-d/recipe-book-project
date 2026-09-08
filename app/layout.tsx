import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Recipe Book project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
