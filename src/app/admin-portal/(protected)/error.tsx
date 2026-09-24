"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <h1 className="font-sans text-xl font-semibold">Что-то пошло не так</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Не удалось выполнить действие. Обычно это значит, что не настроено подключение к базе
        данных (Supabase) — проверьте переменные окружения в .env.local и попробуйте снова.
      </p>
      <Button onClick={() => reset()}>Попробовать снова</Button>
    </div>
  );
}
