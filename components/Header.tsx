import { UserButton } from "@neondatabase/auth/react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b p-4">
      <nav className="flex gap-4 uppercase">
        <Link href={"/"}>Home</Link>
        <Link href={"/recipes"}>Recipes List</Link>
        <Link href={"/recipes/1"}>Recipe Details</Link>
      </nav>
      <UserButton size="icon" />
    </header>
  );
}
