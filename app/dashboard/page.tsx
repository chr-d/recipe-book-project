import { RecipeGrid } from "@/components/RecipeGrid";
import { getUserCookbook, getUserRecipes } from "@/db/queries";
import { requireLogin } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard - mise",
  description: "Find and share delicious recipes.",
};

export default async function Dashboard() {
  const user = await requireLogin();
  const recipesPromise = getUserRecipes(user.id, "", 5);
  const cookbookPromise = getUserCookbook(user.id, "", 5);

  return (
    <>
      <div className="flex flex-col justify-between gap-24 sm:flex-row sm:gap-12">
        <div className="sm:w-1/2">
          <div className="flex justify-between">
            <h2 className="text-2xl tracking-wider">My Recipes</h2>
            <Link
              className="btn btn-secondary btn-sm"
              href={"/dashboard/my-recipes"}
            >
              View all recipes →
            </Link>
          </div>
          <Suspense fallback={<p>Loading results...</p>}>
            <RecipeGrid
              resultPromise={recipesPromise}
              query=""
              empty={{
                message: "You haven't created any recipes yet.",
                btnLabel: "Create a recipe",
                href: "/recipes/add",
              }}
            />
          </Suspense>
        </div>
        <div className="sm:w-1/2">
          <div className="flex justify-between">
            <h2 className="text-tertiary text-2xl tracking-wider">
              My Cookbook
            </h2>
            <Link
              className="btn btn-secondary btn-sm"
              href={"/dashboard/cookbook"}
            >
              View all recipes →
            </Link>
          </div>
          <Suspense fallback={<p>Loading results...</p>}>
            <RecipeGrid
              resultPromise={cookbookPromise}
              query=""
              empty={{
                message: "Your cookbook is empty.",
                btnLabel: "Browse recipes",
                href: "/recipes",
              }}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
