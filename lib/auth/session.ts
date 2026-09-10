import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function requireLogin() {
  const { data, error } = await auth.getSession();

  if (error || !data?.user) {
    redirect("/auth/sign-in");
  }
  return data.user;
}

export async function getUser() {
  const { data, error } = await auth.getSession();
  return data?.user ?? null;
}
