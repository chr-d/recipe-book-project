"use client";

import { RecipeCard } from "@/components/RecipeCard";
import { CookbookEntryWithRecipe, Recipe, RecipeWithCreator } from "@/types";
import { use } from "react";

type GridItem = RecipeWithCreator | CookbookEntryWithRecipe | Recipe;
export function RecipeGrid({
  resultPromise,
  query,
}: {
  resultPromise: Promise<GridItem[]>;
  query: string;
}) {
  const recipes = use(resultPromise);
  return (
    <>
      <h2
        aria-hidden={query ? undefined : true}
        className="mb-4 min-h-6 text-sm font-medium uppercase tracking-wide text-base-content/60"
      >
        {query ? `Results for “${query}”` : "\u00A0"}
      </h2>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]">
        {recipes.map((item) => {
          const recipe = "recipe" in item ? item.recipe : item;
          const creatorName = "creatorName" in item ? item.creatorName : null;

          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              creatorName={creatorName ?? undefined}
            />
          );
        })}
      </div>
    </>
  );
}
