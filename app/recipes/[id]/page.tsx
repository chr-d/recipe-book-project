import { RecipeOwnerActions } from "@/components/RecipeOwnerActions";
import { CookbookAddButton } from "@/components/cookbook/CookbookAddButton";
import { CookbookControls } from "@/components/cookbook/CookbookControls";
import { getCookbookEntryForRecipe, getRecipeById } from "@/db/queries";
import { getUser } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipeId = Number(id);
  if (Number.isNaN(recipeId)) {
    return { title: "Recipe Not Found" };
  }

  const result = await getRecipeById(recipeId);
  if (!result) {
    return { title: "Recipe Not Found" };
  }

  const { recipe } = result;

  return {
    title: `${recipe.title} - mise`,
    description: recipe.description || "Find and share delicious recipes.",
  };
}

export default async function RecipeDetails({ params }: Props) {
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
                  <div className="badge badge-primary badge-lg shrink-0 px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span className="text-nowrap">
                      {recipe.cookTimeMinutes} min
                    </span>
                  </div>
                )}
              </div>

              <p className="text-base-content/60">by {creatorName}</p>

              <div className="flex flex-wrap items-center gap-2">
                {recipe.portionAmount != null && (
                  <div className="badge badge-accent px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                    >
                      <path
                        d="M15.4561 9.42422C15.1273 9.1723 14.6565 9.23463 14.4046 9.56344C14.1527 9.89224 14.215 10.363 14.5438 10.6149C15.1139 11.0517 15.5741 11.632 15.8722 12.304C16.0401 12.6827 16.4832 12.8535 16.8619 12.6855C17.2405 12.5176 17.4113 12.0745 17.2434 11.6958C16.8433 10.794 16.2252 10.0134 15.4561 9.42422Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.25 4.5C14.25 4.84862 14.1707 5.17873 14.0292 5.47327C18.1617 6.39822 21.25 10.0885 21.25 14.5V16.25H21.2668C21.3685 16.25 21.4788 16.25 21.5746 16.2565C21.6826 16.2639 21.8258 16.282 21.9784 16.3452C22.2846 16.472 22.528 16.7154 22.6549 17.0217C22.718 17.1742 22.7361 17.3175 22.7435 17.4254C22.75 17.5212 22.75 17.6315 22.75 17.7332L22.75 17.774C22.75 18.103 22.75 18.3868 22.734 18.6218C22.7171 18.8692 22.68 19.1166 22.5787 19.361C22.3504 19.9124 21.9124 20.3504 21.361 20.5787C21.1166 20.68 20.8692 20.7171 20.6218 20.734C20.3869 20.75 20.103 20.75 19.7741 20.75H4.22601C3.89706 20.75 3.61314 20.75 3.37822 20.734C3.13085 20.7171 2.88341 20.68 2.63897 20.5787C2.08765 20.3504 1.64964 19.9124 1.42128 19.361C1.32002 19.1166 1.28289 18.8692 1.26602 18.6218C1.24999 18.3868 1.24999 18.103 1.25 17.774L1.25 17.7332C1.24998 17.6315 1.24996 17.5213 1.2565 17.4254C1.26386 17.3175 1.28196 17.1742 1.34516 17.0217C1.47202 16.7154 1.71537 16.472 2.02165 16.3452C2.17421 16.282 2.31746 16.2639 2.42537 16.2565C2.52124 16.25 2.63152 16.25 2.73319 16.25L2.75 16.25L2.75 14.5C2.75 10.0885 5.83827 6.39822 9.97082 5.47327C9.82929 5.17873 9.75 4.84862 9.75 4.5C9.75 3.25736 10.7574 2.25 12 2.25C13.2426 2.25 14.25 3.25736 14.25 4.5ZM12 3.75C11.5858 3.75 11.25 4.08579 11.25 4.5C11.25 4.91421 11.5858 5.25 12 5.25C12.4142 5.25 12.75 4.91421 12.75 4.5C12.75 4.08579 12.4142 3.75 12 3.75ZM4.25 14.5C4.25 10.2198 7.71979 6.75 12 6.75C16.2802 6.75 19.75 10.2198 19.75 14.5V16.25H4.25V14.5ZM21.2375 18.5197C21.2496 18.3419 21.25 18.1097 21.25 17.75H2.75C2.75 18.1097 2.75041 18.3419 2.76254 18.5197C2.7742 18.6907 2.79417 18.7558 2.80709 18.787C2.88322 18.9708 3.02922 19.1168 3.21299 19.1929C3.2442 19.2058 3.30933 19.2258 3.48032 19.2375C3.65806 19.2496 3.89029 19.25 4.25 19.25H19.75C20.1097 19.25 20.3419 19.2496 20.5197 19.2375C20.6907 19.2258 20.7558 19.2058 20.787 19.1929C20.9708 19.1168 21.1168 18.9708 21.1929 18.787C21.2058 18.7558 21.2258 18.6907 21.2375 18.5197Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span className="text-nowrap">
                      {recipe.portionAmount} servings
                    </span>
                  </div>
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
                    className="link text-primary underline"
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
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm bg-primary peer"
                      />
                      <span className="peer-checked:line-through peer-checked:opacity-50">
                        {ingredient}
                      </span>
                    </div>
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
                    <span className="badge badge-secondary badge-sm h-6 min-w-6 shrink-0 items-center justify-center font-medium">
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
