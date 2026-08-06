"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Circle, CheckCircle2 } from "lucide-react";

import { markSubmissionRead } from "@/actions/submissions";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/types";

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Свадьба",
  cumatrie: "Кумэтрия",
  baptism: "Крестины",
  "love-story": "Love Story",
  event: "Мероприятие",
};

export function SubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!submissions.length) {
    return (
      <p className="border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
        Заявок пока нет.
      </p>
    );
  }

  const toggle = (submission: ContactSubmission) => {
    startTransition(async () => {
      await markSubmissionRead(submission.id, !submission.is_read);
      router.refresh();
    });
  };

  return (
    <div className="divide-y divide-border border border-border bg-card">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className={cn("flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between", !submission.is_read && "bg-accent/5")}
        >
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              {submission.name || "Без имени"}
              <span className="text-muted-foreground">· {submission.phone}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
              {submission.event_type && <span>{EVENT_TYPE_LABELS[submission.event_type]}</span>}
              {submission.event_date && <span>Дата: {submission.event_date}</span>}
              <span>{format(new Date(submission.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
            </div>
            {submission.message && (
              <p className="mt-2 max-w-xl text-sm text-foreground/80">{submission.message}</p>
            )}
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => toggle(submission)}
            className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground hover:text-accent"
          >
            {submission.is_read ? (
              <CheckCircle2 className="size-4 text-accent" />
            ) : (
              <Circle className="size-4" />
            )}
            {submission.is_read ? "Прочитано" : "Отметить прочитанным"}
          </button>
        </div>
      ))}
    </div>
  );
}
