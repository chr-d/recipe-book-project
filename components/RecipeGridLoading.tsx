import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";

export function RecipeGridLoading({ count = 6 }: { count?: number }) {
  return (
    <div role="status">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-base-content/60">
        Loading results...
      </p>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]">
        {Array.from({ length: count }, (_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
