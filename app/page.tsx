import { createServerActionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/auth/login");
  }

  let hasUser = false;

  try {
    const supabase = await createServerActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasUser = !!user;
  } catch (err) {
    console.error("RootPage: Supabase auth check failed", err);
  }

  if (hasUser) {
    redirect("/dashboard");
  }
  redirect("/auth/login");
}
