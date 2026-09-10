import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { cookbookEntries, recipes } from "./schema";

export const recipeSchema = createInsertSchema(recipes, {
  title: (schema) =>
    schema
      .min(1, "Title is required")
      .max(200, "Title must be under 200 characters"),
  description: (schema) =>
    schema.max(1000, "Description must be under 1000 characters"),
  ingredients: (schema) => schema.min(1, "Add at least one ingredient"),
  instructions: (schema) => schema.min(1, "Add at least one instruction"),
  tags: (schema) => schema.max(4, "Maximum 4 tags"),
  cookTimeMinutes: z
    .number()
    .int("Cook time must be a whole number of minutes")
    .min(1, "Cook time must be at least 1 minute")
    .max(1440, "Cook time must be under 24 hours"),
  portionAmount: z
    .number()
    .int("Portions must be a whole number")
    .min(1, "Must serve at least 1 portion")
    .max(50, "Must serve 50 or fewer portions"),
  imageUrl: z.httpUrl("Must be a valid URL").optional(),
}).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  id: true,
});

export type RecipeInput = z.infer<typeof recipeSchema>;

export const addToCookbookSchema = createInsertSchema(cookbookEntries, {
  personalNotes: (schema) =>
    schema.max(1000, "Notes must be under 1000 characters").optional(),
}).omit({ userId: true, addedAt: true, id: true });

export const updateNotesSchema = createUpdateSchema(cookbookEntries, {
  personalNotes: (schema) =>
    schema.max(1000, "Notes must be under 1000 characters"),
}).omit({ userId: true, addedAt: true, id: true, recipeId: true });
