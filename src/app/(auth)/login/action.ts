"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constans/auth-constan";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { LoginSchema } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validatedFilds = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFilds.success) {
    return {
      status: "error",
      errors: {
        ...validatedFilds.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient({});

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedFilds.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profile) {
    const cookieStore = await cookies();
    cookieStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}
