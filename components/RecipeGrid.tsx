"use client";

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
      <h2>{query}</h2>
      <ul>
        {recipes.map((item) => {
          const recipe = "recipe" in item ? item.recipe : item;
          const creatorName = "creatorName" in item ? item.creatorName : null;
          const personalNotes =
            "entry" in item ? item.entry.personalNotes : null;

          return (
            <li key={recipe.id}>
              {recipe.title}
              {creatorName && ` by ${creatorName}`}
              {personalNotes && ` — ${personalNotes}`}
            </li>
          );
        })}
      </ul>
    </>
  );
}
