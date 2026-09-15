"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { useEffect, useRef, useState } from "react";

type Entry = { id: string; text: string };

let uid = 0;
const nextId = () => `entry-${++uid}`;

const btnClass = "shrink-0 text-lg leading-none disabled:opacity-30";

function Row({
  entry,
  index,
  total,
  numbered,
  onRemove,
  onMove,
}: {
  entry: Entry;
  index: number;
  total: number;
  numbered: boolean;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  const { ref, handleRef, isDragging } = useSortable({ id: entry.id, index });

  return (
    <li
      ref={ref}
      className={`rounded-field border-base-200 bg-base-100 hover:border-base-300 mx-2 flex flex-wrap items-center gap-3 border px-3 py-2 transition-shadow sm:flex-nowrap ${
        isDragging ? "opacity-60 shadow-lg" : ""
      }`}
    >
      <span
        ref={handleRef}
        className="rounded-field bg-base-300/60 flex h-6 w-9 shrink-0 cursor-grab touch-none items-center justify-center select-none"
        aria-hidden
      >
        {numbered ? (
          <span className="text-xs font-semibold">{index + 1}</span>
        ) : (
          <span className="text-base-content/60 text-xs tracking-widest">
            ⋮⋮
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1 wrap-break-word">{entry.text}</span>

      <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:shrink-0 sm:justify-start">
        <button
          type="button"
          className={btnClass}
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label={`Move "${entry.text}" up`}
        >
          ⬆️
        </button>
        <button
          type="button"
          className={btnClass}
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label={`Move "${entry.text}" down`}
        >
          ⬇️
        </button>

        <button
          type="button"
          className={btnClass}
          onClick={() => onRemove(entry.id)}
          aria-label={`Remove "${entry.text}"`}
        >
          🚮
        </button>
      </div>
    </li>
  );
}

export function SortableList({
  name,
  label,
  initialItems = [],
  placeholder = "Add an item…",
  numbered = false,
  onChangeAction,
}: {
  name: string;
  label: string;
  initialItems?: string[];
  placeholder?: string;
  numbered?: boolean;
  onChangeAction?: (items: string[]) => void;
}) {
  const [entries, setEntries] = useState<Entry[]>(
    initialItems.map((text) => ({ id: nextId(), text })),
  );
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeRef = useRef(onChangeAction);
  useEffect(() => {
    onChangeRef.current = onChangeAction;
  }, [onChangeAction]);

  useEffect(() => {
    onChangeRef.current?.(entries.map((e) => e.text));
  }, [entries]);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setEntries((prev) => [...prev, { id: nextId(), text }]);
    setDraft("");
    inputRef.current?.focus();
  };

  const remove = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const moveIndexes = (from: number, to: number) =>
    setEntries((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium">{label}</legend>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline sm:shrink-0"
          onClick={add}
          disabled={!draft.trim()}
        >
          + Add
        </button>
      </div>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const { source } = event.operation;
          if (!isSortable(source)) return;
          const { initialIndex, index } = source;
          if (initialIndex !== index) moveIndexes(initialIndex, index);
        }}
      >
        <ul className="grid gap-2">
          {entries.map((entry, index) => (
            <Row
              key={entry.id}
              entry={entry}
              index={index}
              total={entries.length}
              numbered={numbered}
              onRemove={remove}
              onMove={moveIndexes}
            />
          ))}
        </ul>
      </DragDropProvider>

      {entries.length === 0 && (
        <p className="rounded-field border-base-300 bg-base-200/40 text-base-content/60 mx-2 border border-dashed px-3 py-4 text-center">
          Nothing here yet — add {numbered ? "a step" : "an item"} above.
        </p>
      )}

      {entries.map((e) => (
        <input key={e.id} type="hidden" name={name} value={e.text} />
      ))}
    </fieldset>
  );
}
