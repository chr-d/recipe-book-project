"use client";

import { removeFromCookbook } from "@/app/actions";
import { useTransition } from "react";

export function CookbookRemoveButton({ entryId }: { entryId: number }) {
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    if (!confirm("Remove this recipe from your cookbook?")) return;
    startTransition(async () => {
      await removeFromCookbook(entryId);
    });
  }

  return (
    <button onClick={handleRemove} disabled={pending}>
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
