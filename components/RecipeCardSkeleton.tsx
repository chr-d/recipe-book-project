export function RecipeCardSkeleton() {
  return (
    <div className="card bg-base-100 w-full min-w-75" aria-hidden>
      <div>
        <div className="skeleton h-48 w-full" />
      </div>

      <div className="card-body p-4">
        <div className="skeleton h-7 w-3/4" />
        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-5 w-24" />
        </div>
        <div className="skeleton h-5 w-1/3" />
      </div>
    </div>
  );
}
