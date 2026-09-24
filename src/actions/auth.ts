"use server";

import { redirect } from "next/navigation";

import { verifyAdminCredentials, createAdminSession, clearAdminSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "missing" };
  }

  let valid = false;
  try {
    valid = verifyAdminCredentials(username, password);
  } catch {
    return { error: "config" };
  }

  if (!valid) {
    return { error: "invalid" };
  }

  await createAdminSession();
  redirect("/admin-portal");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin-portal/login");
}
