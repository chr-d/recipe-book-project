"use client";

import { RecipeWithCreator } from "@/types";
import { use } from "react";

export function RecipeGrid({
  resultPromise,
  query,
}: {
  resultPromise: Promise<RecipeWithCreator[]>;
  query: string;
}) {
  const recipes = use(resultPromise);
  return (
    <>
      <h2>{query}</h2>
      <ul>
        {recipes.map(({ recipe, creatorName }) => (
          <li key={recipe.id}>{`${recipe.title} by ${creatorName}`}</li>
        ))}
      </ul>
    </>
  );
}
