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
    <form action={action} key={recipe?.id} className="flex flex-col gap-2">
      <label>
        Title
        <input name="title" defaultValue={recipe?.title} required />
      </label>

      <label>
        Description
        <textarea name="description" defaultValue={recipe?.description ?? ""} />
      </label>

      <label>
        Image URL (optional)
        <input
          name="imageUrl"
          type="url"
          defaultValue={recipe?.imageUrl ?? ""}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label>
          Cook Time (minutes)
          <input
            name="cookTimeMinutes"
            type="number"
            min="1"
            defaultValue={recipe?.cookTimeMinutes ?? ""}
          />
        </label>
        <label>
          Portions
          <input
            name="portionAmount"
            type="number"
            min="1"
            defaultValue={recipe?.portionAmount ?? ""}
          />
        </label>
      </div>

      <label>
        Tags (comma-separated)
        <input
          name="tags"
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
      />

      {state && !state.ok && <p className="error">{state.error}</p>}

      <button type="submit" disabled={pending || listsEmpty}>
        {pending ? "Saving..." : isEdit ? "Update Recipe" : "Create Recipe"}
      </button>
    </form>
  );
}
