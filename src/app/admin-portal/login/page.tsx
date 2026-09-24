"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_NAME } from "@/lib/constants";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Введите логин и пароль.",
  invalid: "Неверный логин или пароль.",
  config: "Админ-доступ не настроен. Проверьте переменные окружения.",
};

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm border border-border bg-card p-8 shadow-sm">
        <h1 className="font-sans text-xl font-semibold">{SITE_NAME} · Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Войдите, чтобы управлять сайтом
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Логин</Label>
            <Input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">
              {ERROR_MESSAGES[state.error] ?? "Что-то пошло не так."}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
