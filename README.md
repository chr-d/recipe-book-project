# mise — Recipe Book

A full-stack recipe application built with Next.js, TypeScript, and Neon PostgreSQL. Discover and publish recipes, then save them to a personal cookbook with notes.

[Live Demo](https://recipe-book-ten-taupe.vercel.app/)

## Core functionality

- Browse recipes and search titles, descriptions, and tags through server-side database queries. Cookbook search also includes personal notes.
- View recipe details with ingredients, ordered instructions, cooking time, portions, and creator attribution.
- Create, edit, and delete recipes, with ownership enforced in server-side mutation queries.
- Save recipes to a personal cookbook, add or edit notes, and remove saved entries.
- Reorder ingredients and instructions using drag-and-drop or up/down buttons.
- Use responsive recipe grids, loading skeletons, form submission feedback, and custom light/dark themes with a saved preference.

## Technologies

| Area           | Tools                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Application    | Next.js 16 App Router, React 19, TypeScript with strict checking          |
| Persistence    | Neon PostgreSQL, Neon serverless HTTP driver, Drizzle ORM and Drizzle Kit |
| Authentication | Neon Auth SDK and supplied authentication/account UI                      |
| Validation     | Zod and drizzle-zod                                                       |
| Interface      | Tailwind CSS 4, daisyUI 5, dnd-kit                                        |
| Development    | ESLint, Prettier, npm lockfile                                            |

## Architecture and decisions

Code is organized into `app/` routes, reusable `components/`, `db/` persistence, and `lib/auth/` helpers.

Server Components initiate database reads through [db/queries.ts](db/queries.ts). Interactive Client Components handle search, editing, and cookbook controls. Mutations use [Server Actions](app/actions.ts); the auth integration has its own route handler.

The [database schema](db/schema.ts) separates shared recipes from user-specific cookbook entries. Foreign keys connect recipes to creators and cookbook entries to users and recipes; deleting a recipe cascades to its saved entries. Ingredients, instructions, and tags use PostgreSQL arrays, keeping this small application's data model straightforward while leaving ingredient quantities as free text.

## Getting started

**Prerequisites:** Node.js 20.9 or newer, npm, and a Neon database branch with Neon Auth enabled and its `neon_auth` schema provisioned. Configure Auth to allow the local application origin, `http://localhost:3000`.

1. Clone this repository, enter its directory, and install dependencies:

   ```bash
   npm ci
   ```

2. Create `.env` in the project root with your own credentials:

   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   NEON_AUTH_BASE_URL=https://YOUR-NEON-AUTH-ENDPOINT
   NEON_AUTH_COOKIE_SECRET=REPLACE_WITH_A_RANDOM_SECRET
   ```

   Generate the cookie secret with `openssl rand -base64 32`. The Auth SDK requires at least 32 characters. `.env` is ignored by Git and is read by both Next.js and the Drizzle configuration.

3. Apply the application migrations to the prepared database, then start development:

   ```bash
   npx drizzle-kit migrate
   npm run dev
   ```

Open [localhost:3000](http://localhost:3000). Register an account and create recipes through the interface; no sample-data seed script is included. The initial migration is a commented introspection snapshot, so migrations alone do not provision Neon Auth.

For production, run `npm run build`, then `npm start`, with these environment variables configured.

## Engineering concepts and learning

The main challenge was connecting the full stack: managing Drizzle migrations, deriving validation schemas and TypeScript types, and keeping database access on the server while supporting interactive client requests. The implementation demonstrates:

- **Types across application layers:** [schema types](db/schema.ts) use Drizzle's `$inferSelect`/`$inferInsert`; [joined query types](db/queries.ts) use `Awaited<ReturnType<…>>`. `RecipeGrid` narrows a union of supported result shapes.
- **Runtime validation alongside static types:** [db/validation.ts](db/validation.ts) derives Zod schemas from database definitions and adds domain limits. Actions parse form data before writes and take user IDs from the authenticated session.
- **Authorization beyond navigation:** [proxy.ts](proxy.ts) protects routes, while update/delete actions also constrain database operations by record ID and current user ID.
- **Asynchronous interface composition:** [RecipeGrid](components/RecipeGrid.tsx) consumes server-started promises with React `use` inside Suspense boundaries; forms use `useActionState` for pending and validation feedback.
- **URL-based search state:** [SearchBar](components/SearchBar.tsx) debounces updates by 300 ms and stores the query in `?q=`, making searches shareable.

## Testing and validation

No automated test suite or CI workflow is included. Run `npm run lint` for the Next.js ESLint rules. For a standalone type check, run `npx next typegen` followed by `npx tsc --noEmit`. Generated types are required by `LayoutProps` and typed routes.

## Limitations and future improvements

- Add integration and browser tests for ownership checks, cookbook persistence, and authentication flows, with CI validation.
- Enforce cookbook uniqueness with a database constraint on `(user_id, recipe_id)`; the current check-before-insert can race.
- Add pagination and search indexes as the recipe collection grows; full listing pages currently fetch all matching rows.
- Add consistent database failure handling and recovery UI; current feedback mainly covers validation and expected authorization failures.
