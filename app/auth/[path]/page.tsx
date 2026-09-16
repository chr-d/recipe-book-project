import { AuthView } from "@neondatabase/auth/react";

export const dynamicParams = false;
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
