import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeGridLoading } from "@/components/RecipeGridLoading";
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
      <Suspense key={query} fallback={<RecipeGridLoading />}>
        <RecipeGrid
          resultPromise={resultPromise}
          query={query}
          empty={{
            message: "You haven't created any recipes yet.",
            btnLabel: "Create a recipe",
            href: "/recipes/add",
          }}
        />
      </Suspense>
    </>
  );
}
