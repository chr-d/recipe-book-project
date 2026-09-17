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
        <div className="hero-content text-neutral-content justify-self-start text-left sm:ml-14">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">mise-en-place</h1>
            <div className="mb-5">
              <p>
                mise, short for &quot;mise en place&quot;, is a French culinary
                phrase which means &quot;putting into place&quot;.
              </p>
              <p>
                This means the preparatory provision of all ingredients and
                working tools before cooking.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={"/auth/sign-up"} className="btn btn-primary">
                Create an account
              </Link>
              <Link href={"/recipes"} className="btn btn-primary">
                Browse recipes
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-content mt-100">
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
