"use client";

import { updateCookbookNotes } from "@/app/actions";
import type { CookbookEntry } from "@/db/schema";
import { useActionState, useEffect, useState } from "react";

export function CookbookNotesEditor({ entry }: { entry: CookbookEntry }) {
  const [isEditing, setIsEditing] = useState(false);

  const [state, formAction, pending] = useActionState(
    updateCookbookNotes.bind(null, entry.id),
    null,
  );

  useEffect(() => {
    if (state?.ok) setIsEditing(false);
  }, [state]);

  if (isEditing) {
    return (
      <form action={formAction}>
        <textarea
          name="personalNotes"
          defaultValue={entry.personalNotes ?? ""}
          rows={3}
          maxLength={1000}
          placeholder="Personal notes"
        />
        {state && !state.ok && <p>{state.error}</p>}
        <div>
          <button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save note"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={pending}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      {entry.personalNotes ? (
        <>
          <p>{entry.personalNotes}</p>
          <div>
            <button onClick={() => setIsEditing(true)}>Edit note</button>
            <form action={formAction}>
              <input type="hidden" name="personalNotes" value="" />
              <button type="submit" disabled={pending}>
                {pending ? "Removing…" : "Remove note"}
              </button>
            </form>
          </div>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>
          + Add a personal note
        </button>
      )}
    </div>
  );
}
