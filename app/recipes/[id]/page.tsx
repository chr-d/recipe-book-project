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

  const savedEntry = user
    ? await getCookbookEntryForRecipe(user.id, recipeId)
    : null;

  return (
    <div>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-80 w-80 object-cover"
        />
      )}
      <h1>{recipe.title}</h1>
      <p>By {creatorName}</p>

      <div>
        {recipe.cookTimeMinutes && (
          <span>Cook Time: {recipe.cookTimeMinutes} min</span>
        )}
        {recipe.portionAmount && <span>Portions: {recipe.portionAmount}</span>}
        {recipe.tags.length > 0 && (
          <span>{recipe.tags.map((t) => `#${t}`).join(" ")}</span>
        )}
      </div>

      {recipe.description && <p>{recipe.description}</p>}

      <section>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        {!user ? (
          <p>
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>{" "}
            to save this recipe to your cookbook.
          </p>
        ) : savedEntry ? (
          <div>
            <CookbookControls entry={savedEntry} />
          </div>
        ) : (
          <div>
            <CookbookAddButton recipeId={recipeId} />
          </div>
        )}
      </section>
    </div>
  );
}
