import { CookbookNotesEditor } from "@/components/cookbook/CookbookNotesEditor";
import { CookbookRemoveButton } from "@/components/cookbook/CookbookRemoveButton";
import type { CookbookEntry } from "@/db/schema";

export function CookbookControls({ entry }: { entry: CookbookEntry }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-success">✓ In your cookbook</p>
      <CookbookNotesEditor entry={entry} />
      <CookbookRemoveButton entryId={entry.id} />
    </div>
  );
}
