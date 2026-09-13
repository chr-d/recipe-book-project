"use server";

import { db } from "@/db";
import { cookbookEntries, recipes } from "@/db/schema";
import {
  addToCookbookSchema,
  recipeSchema,
  updateNotesSchema,
} from "@/db/validation";
import { auth } from "@/lib/auth/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function addToCookbook(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in to save recipes" };
  }

  const parsed = addToCookbookSchema.safeParse({
    recipeId: Number(formData.get("recipeId")),
  });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    return { ok: false, error: errorMessage };
  }

  // Duplicate check
  const existing = await db
    .select({ id: cookbookEntries.id })
    .from(cookbookEntries)
    .where(
      and(
        eq(cookbookEntries.userId, session.data.user.id),
        eq(cookbookEntries.recipeId, parsed.data.recipeId),
      ),
    );
  if (existing.length > 0) {
    return { ok: false, error: "This recipe is already in your cookbook" };
  }

  await db.insert(cookbookEntries).values({
    userId: session.data.user.id,
    recipeId: parsed.data.recipeId,
  });

  revalidatePath(`/recipes/${parsed.data.recipeId}`);
  return { ok: true };
}

export async function updateCookbookNotes(
  entryId: number,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in" };
  }

  const parsed = updateNotesSchema.safeParse({
    personalNotes: (formData.get("personalNotes") as string)?.trim() || null,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const updated = await db
    .update(cookbookEntries)
    .set({ personalNotes: parsed.data.personalNotes })
    .where(
      and(
        eq(cookbookEntries.id, entryId),
        eq(cookbookEntries.userId, session.data.user.id),
      ),
    )
    .returning({ id: cookbookEntries.id, recipeId: cookbookEntries.recipeId });

  if (updated.length === 0) {
    return { ok: false, error: "Entry not found" };
  }

  revalidatePath(`/recipes/${updated[0].recipeId}`);
  return { ok: true };
}

export async function removeFromCookbook(
  entryId: number,
): Promise<ActionResult> {
  const session = await auth.getSession();
  if (!session?.data?.user) {
    return { ok: false, error: "Must be signed in" };
  }

  const deleted = await db
    .delete(cookbookEntries)
    .where(
      and(
        eq(cookbookEntries.id, entryId),
        eq(cookbookEntries.userId, session.data.user.id),
      ),
    )
    .returning({ id: cookbookEntries.id, recipeId: cookbookEntries.recipeId });

  if (deleted.length === 0) {
    return { ok: false, error: "Entry not found" };
  }

  revalidatePath(`/recipes/${deleted[0].recipeId}`);
  return { ok: true };
}
