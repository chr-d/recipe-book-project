import { RecipeGrid } from "@/components/RecipeGrid";
import { SearchBar } from "@/components/SearchBar";
import { getAllRecipes, searchRecipes } from "@/db/queries";
import { Suspense } from "react";

export default async function SearchPage({
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
      <Suspense key={query} fallback={<p>Loading results...</p>}>
        <RecipeGrid resultPromise={resultPromise} query={query} />
      </Suspense>
    </>
  );
}
