import { RecipeGrid } from "@/components/RecipeGrid";
import { getUserCookbook, getUserRecipes } from "@/db/queries";
import { requireLogin } from "@/lib/auth/session";
import Link from "next/link";
import { Suspense } from "react";

export default async function Dashboard() {
  const user = await requireLogin();
  const recipesPromise = getUserRecipes(user.id, "", 5);
  const cookbookPromise = getUserCookbook(user.id, "", 5);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-12">
        <div className="sm:w-1/2">
          <div className="flex justify-between">
            <h2 className="text-2xl">My Recipes</h2>
            <Link href={"/dashboard/my-recipes"}>View all recipes →</Link>
          </div>
          <Suspense fallback={<p>Loading results...</p>}>
            <RecipeGrid resultPromise={recipesPromise} query="" />
          </Suspense>
        </div>
        <div className="sm:w-1/2">
          <div className="flex justify-between">
            <h2 className="text-2xl">My Cookbook</h2>
            <Link href={"/dashboard/cookbook"}>View all recipes →</Link>
          </div>
          <Suspense fallback={<p>Loading results...</p>}>
            <RecipeGrid resultPromise={cookbookPromise} query="" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
