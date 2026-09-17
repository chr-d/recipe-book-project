import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeGridLoading } from "@/components/RecipeGridLoading";
import { SearchBar } from "@/components/SearchBar";
import { getAllRecipes, searchRecipes } from "@/db/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse Recipes - mise",
  description: "Find and share delicious recipes.",
};

export default async function Recipes({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const resultPromise = query ? searchRecipes(query) : getAllRecipes();

  return (
    <>
      <SearchBar initialQuery={query} />
      <Suspense key={query} fallback={<RecipeGridLoading />}>
        <RecipeGrid resultPromise={resultPromise} query={query} />
      </Suspense>
    </>
  );
}
