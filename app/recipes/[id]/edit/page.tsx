import { RecipeForm } from "@/components/RecipeForm";
import { getRecipeById } from "@/db/queries";
import { auth } from "@/lib/auth/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Recipe - mise",
  description: "Find and share delicious recipes.",
};

export default async function EditRecipe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [recipeData, session] = await Promise.all([
    getRecipeById(Number(id)),
    auth.getSession(),
  ]);

  if (!recipeData) {
    return <p>Recipe not found.</p>;
  }

  const currentUser = session?.data?.user;
  if (!currentUser) {
    redirect("/auth/sign-in");
  }

  if (recipeData.recipe.userId !== currentUser.id) {
    return <p>You can only edit your own recipes.</p>;
  }

  return <RecipeForm recipe_data={recipeData} />;
}
