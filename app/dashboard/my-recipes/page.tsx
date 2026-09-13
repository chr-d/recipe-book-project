import { RecipeGrid } from "@/components/RecipeGrid";
import { SearchBar } from "@/components/SearchBar";
import { getUserRecipes } from "@/db/queries";
import { requireLogin } from "@/lib/auth/session";
import { Suspense } from "react";

export default async function UserRecipes({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireLogin();
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const resultPromise = getUserRecipes(user.id, query);

  return (
    <>
      <SearchBar initialQuery={query} />
      <Suspense key={query} fallback={<p>Loading results...</p>}>
        <RecipeGrid resultPromise={resultPromise} query={query} />
      </Suspense>
    </>
  );
}
