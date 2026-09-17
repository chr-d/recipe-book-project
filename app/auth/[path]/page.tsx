import { AuthView } from "@neondatabase/auth/react";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const currentPath = resolvedParams.path || "auth";

  const formattedTitle = currentPath
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} - mise`,
  };
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center">
      <AuthView path={path} redirectTo="/dashboard" />
    </div>
  );
}
