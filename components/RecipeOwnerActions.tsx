"use client";

import { deleteRecipe } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RecipeOwnerActions({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteRecipe(recipeId);
      if (result.ok) {
        router.push("/recipes");
        router.refresh();
      } else if (result.error) {
        alert(`Could not delete recipe: ${result.error}`);
      }
    });
  }

  return (
    <div className="alert alert-info">
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>
          🧑‍🍳 This is <strong>your</strong> recipe.
        </span>
        <div className="flex shrink-0 gap-2">
          <Link href={`/recipes/${recipeId}/edit`} className="btn btn-sm">
            Edit Recipe
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="btn btn-error btn-sm"
          >
            {pending ? "Deleting…" : "Delete Recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}
