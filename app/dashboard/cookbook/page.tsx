import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeGridLoading } from "@/components/RecipeGridLoading";
import { SearchBar } from "@/components/SearchBar";
import { getUserCookbook } from "@/db/queries";
import { requireLogin } from "@/lib/auth/session";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Cookbook - mise",
  description: "Find and share delicious recipes.",
};

export default async function Coobook({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireLogin();
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const resultPromise = getUserCookbook(user.id, query);

  return (
    <>
      <SearchBar initialQuery={query} />
      <Suspense key={query} fallback={<RecipeGridLoading />}>
        <RecipeGrid
          resultPromise={resultPromise}
          query={query}
          empty={{
            message: "Your cookbook is empty.",
            btnLabel: "Browse recipes",
            href: "/recipes",
          }}
        />
      </Suspense>
    </>
  );
}
