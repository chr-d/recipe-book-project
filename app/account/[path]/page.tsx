import { AccountView } from "@neondatabase/auth/react";

export const dynamicParams = false;
export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center">
      <AccountView path={path} />
    </div>
  );
}
