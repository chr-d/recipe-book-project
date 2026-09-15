"use client";

import { addToCookbook } from "@/app/actions";
import { useActionState } from "react";

export function CookbookAddButton({ recipeId }: { recipeId: number }) {
  const [state, formAction, pending] = useActionState(addToCookbook, null);

  if (state?.ok) {
    return <p className="text-success">✓ Saved to your cookbook</p>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="recipeId" value={recipeId} />
      {state && !state.ok && <p className="text-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-success">
        {pending ? "Saving…" : "Save to Cookbook"}
      </button>
    </form>
  );
}
