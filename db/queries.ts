import { db } from "@/db";
import { cookbookEntries, recipes, userInNeonAuth } from "@/db/schema";
import { and, arrayContains, desc, eq, ilike, or } from "drizzle-orm";

// PUBLIC: All recipes
export async function getAllRecipes(limit?: number) {
  const query = db
    .select({
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(recipes)
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .orderBy(desc(recipes.createdAt));

  return await (limit ? query.limit(limit) : query);
}

// PUBLIC: Search across all recipes
export async function searchRecipes(searchQuery: string, limit?: number) {
  const query = db
    .select({
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(recipes)
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .where(
      or(
        ilike(recipes.title, `%${searchQuery}%`),
        ilike(recipes.description, `%${searchQuery}%`),
        arrayContains(recipes.tags, [searchQuery.toLowerCase()]),
      ),
    )
    .orderBy(desc(recipes.createdAt));

  return await (limit ? query.limit(limit) : query);
}

// PUBLIC: Single recipe detail (No limit needed)
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
export async function getUserRecipes(
  userId: string,
  searchQuery?: string,
  limit?: number,
) {
  const query = db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.userId, userId),
        searchQuery
          ? or(
              ilike(recipes.title, `%${searchQuery}%`),
              ilike(recipes.description, `%${searchQuery}%`),
              arrayContains(recipes.tags, [searchQuery.toLowerCase()]),
            )
          : undefined,
      ),
    )
    .orderBy(desc(recipes.createdAt));

  return await (limit ? query.limit(limit) : query);
}

// PROTECTED: User's cookbook entries
export async function getUserCookbook(
  userId: string,
  searchQuery?: string,
  limit?: number,
) {
  const query = db
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
        searchQuery
          ? or(
              ilike(recipes.title, `%${searchQuery}%`),
              ilike(recipes.description, `%${searchQuery}%`),
              arrayContains(recipes.tags, [searchQuery.toLowerCase()]),
              ilike(cookbookEntries.personalNotes, `%${searchQuery}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(cookbookEntries.addedAt));

  return await (limit ? query.limit(limit) : query);
}

// Cookbook entry for user and recipe ID
export async function getCookbookEntryForRecipe(
  userId: string,
  recipeId: number,
) {
  const result = await db
    .select()
    .from(cookbookEntries)
    .where(
      and(
        eq(cookbookEntries.userId, userId),
        eq(cookbookEntries.recipeId, recipeId),
      ),
    )
    .limit(1);
  return result[0] ?? null;
}

// Types inferred from DB query responses with joins
export type RecipeWithCreator = Awaited<
  ReturnType<typeof getAllRecipes>
>[number];
export type CookbookEntryWithRecipe = Awaited<
  ReturnType<typeof getUserCookbook>
>[number];
