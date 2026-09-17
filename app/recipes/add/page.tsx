import { RecipeForm } from "@/components/RecipeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Recipe - mise",
  description: "Find and share delicious recipes.",
};

export default function AddRecipe() {
  return <RecipeForm />;
}
