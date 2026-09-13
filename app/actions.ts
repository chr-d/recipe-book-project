"use server";

import { db } from "@/db";
import { recipes } from "@/db/schema";
import { recipeSchema } from "@/db/validation";
import { auth } from "@/lib/auth/server";
import { and, eq } from "drizzle-orm";

export type ActionResult = {
  ok: boolean;
  error?: string;
};

export async function createRecipe(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in to create recipes" };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    cookTimeMinutes: formData.get("cookTimeMinutes")
      ? Number(formData.get("cookTimeMinutes"))
      : undefined,
    portionAmount: formData.get("portionAmount")
      ? Number(formData.get("portionAmount"))
      : undefined,

    // Old textarea line split input
    // ingredients: (formData.get("ingredients") as string)
    //   ?.split("\n")
    //   .map((line) => line.trim())
    //   .filter(Boolean),
    // instructions: (formData.get("instructions") as string)
    //   ?.split("\n")
    //   .map((line) => line.trim())
    //   .filter(Boolean),

    ingredients: formData
      .getAll("ingredients")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),
    instructions: formData
      .getAll("instructions")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),

    // Tags comma-separated input split
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  };

  const parsed = recipeSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    return { ok: false, error: errorMessage };
  }

  await db.insert(recipes).values({
    ...parsed.data,
    userId: session.data.user.id,
  });

  return { ok: true };
}

export async function updateRecipe(
  recipeId: number,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in" };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    cookTimeMinutes: formData.get("cookTimeMinutes")
      ? Number(formData.get("cookTimeMinutes"))
      : undefined,
    portionAmount: formData.get("portionAmount")
      ? Number(formData.get("portionAmount"))
      : undefined,
    ingredients: formData
      .getAll("ingredients")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),
    instructions: formData
      .getAll("instructions")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  };
  const parsed = recipeSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    return { ok: false, error: errorMessage };
  }

  const updated = await db
    .update(recipes)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(eq(recipes.id, recipeId), eq(recipes.userId, session.data.user.id)),
    )
    .returning({ id: recipes.id });

  if (updated.length === 0) {
    return {
      ok: false,
      error: "Recipe not found or you do not have permission",
    };
  }

  return { ok: true };
}

export async function deleteRecipe(recipeId: number): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in" };
  }

  const deleted = await db
    .delete(recipes)
    .where(
      and(eq(recipes.id, recipeId), eq(recipes.userId, session.data.user.id)),
    )
    .returning({ id: recipes.id });

  if (deleted.length === 0) {
    return {
      ok: false,
      error: "Recipe not found or you do not have permission",
    };
  }

  return { ok: true };
}
