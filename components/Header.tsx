import { UserButton } from "@neondatabase/auth/react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-base-100">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <nav className="flex gap-4 uppercase">
          <Link href={"/"}>Home</Link>
          <Link href={"/recipes"}>Recipes List</Link>
          <Link href={"/recipes/1"}>Recipe Details</Link>
        </nav>
        <UserButton
          size="icon"
          additionalLinks={[
            {
              href: "/dashboard",
              label: "Dashboard",
              signedIn: true,
              separator: false,
            },
            {
              href: "/dashboard/my-recipes",
              label: "My Recipes",
              signedIn: true,
              separator: false,
            },
            {
              href: "/dashboard/cookbook",
              label: "My Cookbook",
              signedIn: true,
              separator: true,
            },
          ]}
        />
      </div>
    </header>
  );
}
