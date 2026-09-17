import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeGridLoading } from "@/components/RecipeGridLoading";
import { getAllRecipes } from "@/db/queries";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const resultPromise = getAllRecipes(3);
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/reserve/EnF7DhHROS8OMEp2pCkx_Dufer%20food%20overhead%20hig%20res.jpg?q=80&w=2956&auto=format&fit=crop)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content justify-self-start text-left sm:ml-20">
          <div className="max-w-md">
            <h1 className="font-pinyon-script mb-3 text-7xl">mise</h1>
            <div className="mb-5">
              <p className="text-pretty">
                short for French mise en place — &quot;everything in its
                place&quot; brings culinary order to your kitchen. Just like top
                chefs prepare their ingredients before cooking, our recipe
                platform organizes your shopping lists, step-by-step prep, and
                timings into one seamless workspace. No chaos, no missing
                spices—just pure cooking joy, ready when you are.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={"/auth/sign-up"} className="btn btn-secondary">
                Create Account
              </Link>
              <Link href={"/recipes"} className="btn btn-secondary">
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-content text-neutral-content mt-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19.9201 8.9502L13.4001 15.4702C12.6301 16.2402 11.3701 16.2402 10.6001 15.4702L4.08008 8.9502"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>

      <h2 className="mt-12 text-2xl">Latest Recipes</h2>
      <Suspense key={""} fallback={<RecipeGridLoading />}>
        <RecipeGrid resultPromise={resultPromise} query={""} />
      </Suspense>
      <div className="mt-4 flex justify-end">
        <Link href={"/recipes"} className="btn btn-accent self-end">
          → View all recipes
        </Link>
      </div>
    </>
  );
}
