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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state?.ok) setIsEditing(false);
  }, [state]);

  if (isEditing) {
    return (
      <form action={formAction} className="flex flex-col gap-2">
        <textarea
          name="personalNotes"
          defaultValue={entry.personalNotes ?? ""}
          rows={3}
          maxLength={1000}
          placeholder="Personal notes"
          className="textarea"
          disabled={pending}
        />
        {state && !state.ok && <p className="text-error">{state.error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="btn btn-sm">
            {pending ? "Saving…" : "Save note"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={pending}
            className="btn btn-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entry.personalNotes ? (
        <>
          <div className="bg-base-300 rounded-2xl border-2">
            <p className="text-base-content/60 p-2 text-xs uppercase">
              Personal Notes
            </p>
            <p className="p-4">{entry.personalNotes}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-sm self-start"
          >
            Edit note
          </button>
          <form action={formAction}>
            <input type="hidden" name="personalNotes" value="" />
            <button type="submit" disabled={pending} className="btn btn-sm">
              {pending ? "Removing…" : "Remove note"}
            </button>
          </form>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-sm self-start"
        >
          + Add a personal note
        </button>
      )}
    </div>
  );
}
