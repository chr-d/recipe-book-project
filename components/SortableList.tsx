"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { useEffect, useRef, useState } from "react";

type Entry = { id: string; text: string };

let uid = 0;
const nextId = () => `entry-${++uid}`;

const btnClass =
  "inline-flex cursor-pointer rounded border-none bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50";

function Row({
  entry,
  index,
  total,
  onRemove,
  onMove,
}: {
  entry: Entry;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  const { ref, handleRef, isDragging } = useSortable({ id: entry.id, index });

  return (
    <li
      ref={ref}
      className={`flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
    >
      <span
        ref={handleRef}
        className="inline-flex cursor-grab touch-none text-neutral-500"
      >
        ↕️
      </span>

      <span className="flex-1">{entry.text}</span>

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
    </li>
  );
}

export function SortableList({
  name,
  label,
  initialItems = [],
  placeholder = "Add an item…",
  onChangeAction,
}: {
  name: string;
  label: string;
  initialItems?: string[];
  placeholder?: string;
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
    <fieldset>
      <label className="font-semibold">
        {label}

        <div className="mt-2 mb-3 flex gap-2">
          <input
            ref={inputRef}
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
            onClick={add}
            disabled={!draft.trim()}
            className={`inline-flex items-center gap-1 ${!draft.trim() ? "opacity-50" : ""}`}
          >
            ➕ Add
          </button>
        </div>
      </label>

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const { source } = event.operation;
          if (!isSortable(source)) return;
          const { initialIndex, index } = source;
          if (initialIndex !== index) moveIndexes(initialIndex, index);
        }}
      >
        <ul className="text-base-300 grid gap-1.5">
          {entries.map((entry, index) => (
            <Row
              key={entry.id}
              entry={entry}
              index={index}
              total={entries.length}
              onRemove={remove}
              onMove={moveIndexes}
            />
          ))}
        </ul>
      </DragDropProvider>

      {entries.map((e) => (
        <input
          key={e.id}
          type="hidden"
          name={name}
          value={e.text}
          className="font-black"
        />
      ))}
    </fieldset>
  );
}
