"use client";

import { createRecipe, updateRecipe } from "@/app/actions";
import { SortableList } from "@/components/SortableList";
import type { ActionResult, RecipeWithCreator } from "@/types";
import { useState } from "react";
import { useActionState } from "react";

export function RecipeForm({
  recipe_data,
}: {
  recipe_data?: RecipeWithCreator;
}) {
  const isEdit = Boolean(recipe_data);
  const recipe = recipe_data?.recipe;

  const [state, action, pending] = useActionState(
    isEdit
      ? (prev: ActionResult | null, formData: FormData) =>
          updateRecipe(recipe!.id, prev, formData)
      : createRecipe,
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(
    recipe?.ingredients ?? [],
  );
  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions ?? [],
  );

  const listsEmpty = ingredients.length === 0 || instructions.length === 0;

  return (
    <div className="mx-auto w-full lg:max-w-4xl">
      <form action={action} key={recipe?.id} className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Recipe" : "New Recipe"}
        </h1>

        <div className="rounded-box border-base-300 bg-base-200 flex flex-col gap-6 border p-4 sm:p-6">
          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium">Title</span>
            <input
              name="title"
              className="input"
              defaultValue={recipe?.title}
              required
            />
          </label>

          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              name="description"
              className="textarea min-h-40 w-full"
              defaultValue={recipe?.description ?? ""}
            />
          </label>

          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium">Image URL (optional)</span>
            <input
              name="imageUrl"
              type="url"
              className="input"
              defaultValue={recipe?.imageUrl ?? ""}
            />
          </label>

          <div className="flex flex-wrap gap-6">
            <label className="flex w-32 flex-col gap-2 sm:w-44">
              <span className="text-sm font-medium">Cook time (min)</span>
              <input
                name="cookTimeMinutes"
                type="number"
                min="1"
                className="input"
                defaultValue={recipe?.cookTimeMinutes ?? ""}
              />
            </label>
            <label className="flex w-32 flex-col gap-2 sm:w-44">
              <span className="text-sm font-medium">Portions</span>
              <input
                name="portionAmount"
                type="number"
                min="1"
                className="input"
                defaultValue={recipe?.portionAmount ?? ""}
              />
            </label>
          </div>

          <label className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium">Tags (comma-separated)</span>
            <input
              name="tags"
              className="input"
              defaultValue={recipe?.tags.join(", ") ?? ""}
              placeholder="italian, dinner, vegetarian"
            />
          </label>

          <SortableList
            name="ingredients"
            label="Ingredients"
            initialItems={recipe?.ingredients ?? []}
            onChangeAction={setIngredients}
            placeholder="500g flour"
          />

          <SortableList
            name="instructions"
            label="Instructions"
            initialItems={recipe?.instructions ?? []}
            onChangeAction={setInstructions}
            placeholder="Preheat oven to 180°C"
            numbered
          />

          <div className="border-base-300 flex flex-col gap-3 border-t pt-4">
            {state && !state.ok && (
              <p className="text-error text-sm font-medium">{state.error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-fit"
              disabled={pending || listsEmpty}
            >
              {pending
                ? "Saving..."
                : isEdit
                  ? "Update Recipe"
                  : "Create Recipe"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
