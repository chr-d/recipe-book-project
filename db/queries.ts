import { db } from "@/db";
import { cookbookEntries, recipes, userInNeonAuth } from "@/db/schema";
import { desc, eq, ilike } from "drizzle-orm";

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
    .where(ilike(recipes.title, `%${query}%`))
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
export async function getUserRecipes(userId: string) {
  return db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));
}

// PROTECTED: User's cookbook entries
export async function getUserCookbook(userId: string) {
  return db
    .select({
      entry: cookbookEntries,
      recipe: recipes,
      creatorName: userInNeonAuth.name,
    })
    .from(cookbookEntries)
    .innerJoin(recipes, eq(cookbookEntries.recipeId, recipes.id))
    .innerJoin(userInNeonAuth, eq(recipes.userId, userInNeonAuth.id))
    .where(eq(cookbookEntries.userId, userId))
    .orderBy(desc(cookbookEntries.addedAt));
}
