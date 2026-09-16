"use client";

import { RecipeCard } from "@/components/RecipeCard";
import { CookbookEntryWithRecipe, Recipe, RecipeWithCreator } from "@/types";
import type { Route } from "next";
import Link from "next/link";
import { use } from "react";

type GridItem = RecipeWithCreator | CookbookEntryWithRecipe | Recipe;
export function RecipeGrid({
  resultPromise,
  query,
  empty,
}: {
  resultPromise: Promise<GridItem[]>;
  query: string;
  empty?: {
    message: string;
    btnLabel: string;
    href: Route;
  };
}) {
  const recipes = use(resultPromise);
  return (
    <>
      <h2
        aria-hidden={query ? undefined : true}
        className="text-base-content/60 mb-4 min-h-6 text-sm font-medium tracking-wide uppercase"
      >
        {query ? `Results for “${query}”` : "\u00A0"}
      </h2>
      {recipes.length === 0 && query === "" && empty ? (
        <div role="alert" className="alert">
          <div>
            <p>{empty.message}</p>
            <Link href={empty.href} className="btn btn-primary mt-2">
              {empty.btnLabel}
            </Link>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <div role="alert" className="alert">
          <p>
            No recipes found for{" "}
            <span className="font-semibold">“{query}”</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
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
      )}
    </>
  );
}
