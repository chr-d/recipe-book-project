"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { useEffect, useRef, useState } from "react";

type Entry = { id: string; text: string };

let uid = 0;
const nextId = () => `entry-${++uid}`;

const btnClass =
  "shrink-0 text-lg leading-none disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed";

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
        className="rounded-field flex h-6 w-9 shrink-0 cursor-grab touch-none items-center justify-center select-none"
        aria-hidden
      >
        {numbered ? (
          <span className="badge badge-secondary badge-sm h-6 min-w-6 font-medium">
            {index + 1}
          </span>
        ) : (
          <span className="badge badge-ghost badge-sm h-6 min-w-6 px-2 font-medium tracking-widest">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.367 1.25H15.633C16.7251 1.24999 17.5906 1.24999 18.2883 1.30699C19.0017 1.36527 19.6053 1.48688 20.1565 1.76772C21.0502 2.22312 21.7769 2.94978 22.2323 3.84355C22.5131 4.39472 22.6347 4.99835 22.693 5.71173C22.75 6.40935 22.75 7.27484 22.75 8.36698V15.633C22.75 16.7252 22.75 17.5906 22.693 18.2883C22.6347 19.0017 22.5131 19.6053 22.2323 20.1565C21.7769 21.0502 21.0502 21.7769 20.1565 22.2323C19.6053 22.5131 19.0017 22.6347 18.2883 22.693C17.5906 22.75 16.7252 22.75 15.633 22.75H8.36698C7.27485 22.75 6.40935 22.75 5.71173 22.693C4.99834 22.6347 4.39472 22.5131 3.84355 22.2323C2.94978 21.7769 2.22312 21.0502 1.76772 20.1565C1.48688 19.6053 1.36527 19.0017 1.30699 18.2883C1.24999 17.5906 1.24999 16.7251 1.25 15.633V8.36699C1.24999 7.27485 1.24999 6.40935 1.30699 5.71173C1.36527 4.99834 1.48688 4.39472 1.76772 3.84355C2.22312 2.94978 2.94978 2.22312 3.84355 1.76772C4.39472 1.48688 4.99834 1.36527 5.71173 1.30699C6.40935 1.24999 7.27486 1.24999 8.367 1.25ZM16.5303 11.5303C16.2374 11.8232 15.7626 11.8232 15.4697 11.5303L12.75 8.81066V17C12.75 17.4142 12.4142 17.75 12 17.75C11.5858 17.75 11.25 17.4142 11.25 17V8.81066L8.53033 11.5303C8.23744 11.8232 7.76256 11.8232 7.46967 11.5303C7.17678 11.2374 7.17678 10.7626 7.46967 10.4697L11.4697 6.46967C11.6103 6.32902 11.8011 6.25 12 6.25C12.1989 6.25 12.3897 6.32902 12.5303 6.46967L16.5303 10.4697C16.8232 10.7626 16.8232 11.2374 16.5303 11.5303Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          className={btnClass}
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label={`Move "${entry.text}" down`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.367 1.25H15.633C16.7251 1.24999 17.5906 1.24999 18.2883 1.30699C19.0017 1.36527 19.6053 1.48688 20.1565 1.76772C21.0502 2.22312 21.7769 2.94978 22.2323 3.84355C22.5131 4.39472 22.6347 4.99835 22.693 5.71173C22.75 6.40935 22.75 7.27485 22.75 8.36698V15.633C22.75 16.7252 22.75 17.5906 22.693 18.2883C22.6347 19.0017 22.5131 19.6053 22.2323 20.1565C21.7769 21.0502 21.0502 21.7769 20.1565 22.2323C19.6053 22.5131 19.0017 22.6347 18.2883 22.693C17.5906 22.75 16.7252 22.75 15.633 22.75H8.36698C7.27485 22.75 6.40935 22.75 5.71173 22.693C4.99834 22.6347 4.39472 22.5131 3.84355 22.2323C2.94978 21.7769 2.22312 21.0502 1.76772 20.1565C1.48688 19.6053 1.36527 19.0017 1.30699 18.2883C1.24999 17.5906 1.24999 16.7251 1.25 15.633V8.36699C1.24999 7.27485 1.24999 6.40936 1.30699 5.71173C1.36527 4.99834 1.48688 4.39472 1.76772 3.84355C2.22312 2.94978 2.94978 2.22312 3.84355 1.76772C4.39472 1.48688 4.99834 1.36527 5.71173 1.30699C6.40936 1.24999 7.27486 1.24999 8.367 1.25ZM16.5303 12.4697C16.2374 12.1768 15.7626 12.1768 15.4697 12.4697L12.75 15.1893V7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V15.1893L8.53033 12.4697C8.23744 12.1768 7.76256 12.1768 7.46967 12.4697C7.17678 12.7626 7.17678 13.2374 7.46967 13.5303L11.4697 17.5303C11.6103 17.671 11.8011 17.75 12 17.75C12.1989 17.75 12.3897 17.671 12.5303 17.5303L16.5303 13.5303C16.8232 13.2374 16.8232 12.7626 16.5303 12.4697Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>

        <button
          type="button"
          className={btnClass}
          onClick={() => onRemove(entry.id)}
          aria-label={`Remove "${entry.text}"`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-error"
          >
            <path
              d="M21 5.75C21.414 5.75 21.75 5.414 21.75 5H21.752C21.752 4.586 21.416 4.25 21.002 4.25H18.286C17.769 4.25 17.667 4.243 17.586 4.218C17.492 4.19 17.404 4.143 17.328 4.08C17.262 4.026 17.199 3.946 16.913 3.516L16.2894 2.58054C16.0749 2.25879 15.8855 1.9748 15.627 1.762C15.398 1.574 15.135 1.433 14.852 1.347C14.529 1.25 14.186 1.25 13.797 1.25H10.204C9.814 1.25 9.472 1.25 9.15 1.347C8.867 1.433 8.603 1.574 8.375 1.762C8.11618 1.9752 7.92817 2.25724 7.71442 2.57788L7.089 3.516C6.803 3.945 6.74 4.026 6.674 4.08C6.598 4.142 6.51 4.189 6.416 4.218C6.334 4.242 6.232 4.25 5.716 4.25H3C2.586 4.25 2.25 4.586 2.25 5C2.25 5.414 2.586 5.75 3 5.75H21Z"
              fill="currentColor"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.307 7.25C19.56 7.25 19.687 7.25 19.783 7.293H19.785C19.914 7.35 20.012 7.459 20.057 7.592C20.0896 7.69083 20.0783 7.81506 20.0558 8.06121L20.055 8.07L19.1164 18.126C19.0541 18.7972 19.0033 19.3447 18.926 19.789C18.846 20.253 18.729 20.662 18.505 21.039C18.15 21.636 17.626 22.114 16.998 22.412C16.602 22.6 16.183 22.678 15.714 22.715C15.26 22.75 14.705 22.75 14.023 22.75H9.98C9.298 22.75 8.742 22.75 8.289 22.715C7.82 22.678 7.401 22.6 7.005 22.412C6.378 22.114 5.853 21.636 5.498 21.039C5.274 20.662 5.157 20.253 5.077 19.789C5 19.341 4.948 18.788 4.885 18.109L3.948 8.07C3.924 7.818 3.913 7.692 3.946 7.592C3.991 7.458 4.089 7.35 4.218 7.293C4.314 7.25 4.441 7.25 4.694 7.25H19.307ZM9.25 18.0001V11C9.25 10.5858 9.58579 10.25 10 10.25C10.4142 10.25 10.75 10.5858 10.75 11V18.0001C10.75 18.4143 10.4142 18.7501 10 18.7501C9.58579 18.7501 9.25 18.4143 9.25 18.0001ZM13.25 18L13.25 11C13.25 10.5858 13.5858 10.25 14 10.25C14.4142 10.25 14.75 10.5858 14.75 11L14.75 18C14.75 18.4142 14.4142 18.75 14 18.75C13.5858 18.75 13.25 18.4142 13.25 18Z"
              fill="currentColor"
            ></path>
          </svg>
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
      <legend className="font-mediuma text-primary mb-2">{label}</legend>

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
          className="btn btn-sm btn-secondary sm:shrink-0"
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
