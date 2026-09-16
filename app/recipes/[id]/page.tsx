import { RecipeOwnerActions } from "@/components/RecipeOwnerActions";
import { CookbookAddButton } from "@/components/cookbook/CookbookAddButton";
import { CookbookControls } from "@/components/cookbook/CookbookControls";
import { getCookbookEntryForRecipe, getRecipeById } from "@/db/queries";
import { getUser } from "@/lib/auth/session";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecipeDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeId = Number(id);
  if (Number.isNaN(recipeId)) notFound();

  const result = await getRecipeById(recipeId);
  if (!result) notFound();

  const { recipe, creatorName } = result;
  const user = await getUser();
  const isOwner = user?.id === recipe.userId;

  const savedEntry = user
    ? await getCookbookEntryForRecipe(user.id, recipeId)
    : null;

  return (
    <div className="flex flex-col gap-6">
      {user && isOwner && <RecipeOwnerActions recipeId={recipeId} />}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-6 lg:sticky lg:top-16 lg:self-start">
          <div className="card bg-base-200 overflow-hidden shadow-sm">
            {recipe.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-64 w-full object-cover sm:h-80"
              />
            ) : (
              <div className="bg-base-300 flex h-64 w-full items-center justify-center sm:h-80">
                <p className="text-base-content/60">No photo available</p>
              </div>
            )}

            <div className="card-body p-6">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-primary text-2xl font-bold">
                  {recipe.title}
                </h1>
                {recipe.cookTimeMinutes != null && (
                  <span className="badge badge-outline badge-lg shrink-0">
                    ⏱ {recipe.cookTimeMinutes} min
                  </span>
                )}
              </div>

              <p className="text-base-content/60">by {creatorName}</p>

              <div className="flex flex-wrap gap-2">
                {recipe.portionAmount != null && (
                  <span className="badge badge-outline">
                    🍽 {recipe.portionAmount} servings
                  </span>
                )}
                {recipe.tags.length > 0 &&
                  recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-neutral badge-sm px-2"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {recipe.description && (
                <p className="text-base-content/80">{recipe.description}</p>
              )}

              {!user ? (
                <p className="p-2">
                  <Link
                    href="/auth/sign-in"
                    className="link text-accent underline"
                  >
                    Sign in
                  </Link>{" "}
                  to save this recipe to your cookbook.
                </p>
              ) : savedEntry ? (
                <CookbookControls entry={savedEntry} />
              ) : (
                <CookbookAddButton recipeId={recipeId} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="card bg-base-200 shadow-sm">
            <div className="card-body p-6">
              <h2 className="card-title text-primary">Ingredients</h2>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="py-2">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card bg-base-200 shadow-sm">
            <div className="card-body p-6">
              <h2 className="card-title text-primary">Instructions</h2>
              <ol className="flex flex-col gap-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="badge badge-neutral badge-sm h-6 min-w-6 shrink-0 items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <p className="flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
