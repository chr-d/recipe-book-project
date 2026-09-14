import { CookbookNotesEditor } from "@/components/cookbook/CookbookNotesEditor";
import { CookbookRemoveButton } from "@/components/cookbook/CookbookRemoveButton";
import type { CookbookEntry } from "@/db/schema";

export function CookbookControls({ entry }: { entry: CookbookEntry }) {
  return (
    <div>
      <p>✓ In your cookbook</p>
      <p>Personal notes</p>
      <CookbookNotesEditor entry={entry} />
      <CookbookRemoveButton entryId={entry.id} />
    </div>
  );
}
