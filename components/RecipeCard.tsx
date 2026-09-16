import { Recipe } from "@/types";
import Link from "next/link";

export function RecipeCard({
  recipe,
  creatorName,
}: {
  recipe: Recipe;
  creatorName?: string;
}) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="card bg-base-200 w-full min-w-75 overflow-hidden shadow-sm"
    >
      <div>
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="bg-base-300 flex h-48 w-full items-center justify-center">
            <p className="text-base-content/60">No photo available</p>
          </div>
        )}
      </div>

      <div className="card-body p-4">
        <h2 className="card-title text-primary">{recipe.title}</h2>

        <div className="flex flex-wrap gap-2">
          {recipe.cookTimeMinutes != null && (
            <span className="badge badge-neutral badge-sm gap-1 px-2">
              ⏱ {recipe.cookTimeMinutes} min
            </span>
          )}
          {recipe.portionAmount != null && (
            <span className="badge badge-neutral badge-sm px-2">
              🍽 {recipe.portionAmount} servings
            </span>
          )}
        </div>

        <p className="text-base-content/60 text-sm">
          {creatorName ? `by ${creatorName}` : "\u00A0"}
        </p>
      </div>
    </Link>
  );
}
