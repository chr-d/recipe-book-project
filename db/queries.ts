import { db } from "@/db";
import { cookbookEntries, recipes, userInNeonAuth } from "@/db/schema";
import { and, arrayContains, desc, eq, ilike, or } from "drizzle-orm";

// PUBLIC: All recipes
export async function getAllRecipes() {
  return db
    .select({
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(recipes)
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .orderBy(desc(recipes.createdAt));
}

// PUBLIC: Search across all recipes
export async function searchRecipes(query: string) {
  return db
    .select({
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(recipes)
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .where(
      or(
        ilike(recipes.title, `%${query}%`),
        ilike(recipes.description, `%${query}%`),
        arrayContains(recipes.tags, [query.toLowerCase()]),
      ),
    )
    .orderBy(desc(recipes.createdAt));
}

// PUBLIC: Single recipe detail
export async function getRecipeById(id: number) {
  const result = await db
    .select({
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(recipes)
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .where(eq(recipes.id, id));
  return result[0] ?? null;
}

// PROTECTED: User's own recipes for dashboard
export async function getUserRecipes(userId: string, query?: string) {
  return db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.userId, userId),
        query
          ? or(
              ilike(recipes.title, `%${query}%`),
              ilike(recipes.description, `%${query}%`),
              arrayContains(recipes.tags, [query.toLowerCase()]),
            )
          : undefined,
      ),
    )
    .orderBy(desc(recipes.createdAt));
}

// PROTECTED: User's cookbook entries
export async function getUserCookbook(userId: string, query?: string) {
  return db
    .select({
      entry: cookbookEntries,
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(cookbookEntries)
    .innerJoin(recipes, eq(cookbookEntries.recipeId, recipes.id))
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .where(
      and(
        eq(cookbookEntries.userId, userId),
        query
          ? or(
              ilike(recipes.title, `%${query}%`),
              ilike(recipes.description, `%${query}%`),
              arrayContains(recipes.tags, [query.toLowerCase()]),
              ilike(cookbookEntries.personalNotes, `%${query}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(cookbookEntries.addedAt));
}

// Types inferred from DB query responses with joins
export type RecipeWithCreator = Awaited<
  ReturnType<typeof getAllRecipes>
>[number];
export type CookbookEntryWithRecipe = Awaited<
  ReturnType<typeof getUserCookbook>
>[number];
