"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

export interface ContactActionResult {
  success: boolean;
  error?: string;
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** Best-effort forward to a Google Apps Script Web App that appends a row to a Google Sheet (free, no backend needed). */
async function forwardToGoogleSheets(values: ContactFormValues) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      console.error("Google Sheets webhook failed", res.status, await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error("Google Sheets webhook threw", error);
    return false;
  }
}

/** Best-effort email notification via Resend's free tier (no-op if not configured). */
async function sendEmailNotification(values: ContactFormValues) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "Exclusive Foto Studio <onboarding@resend.dev>",
        to,
        subject: `Новая заявка — ${values.name || values.phone}`,
        text: [
          `Имя: ${values.name || "—"}`,
          `Телефон: ${values.phone}`,
          `Тип события: ${values.eventType || "—"}`,
          `Дата события: ${values.eventDate || "—"}`,
          `Сообщение: ${values.message || "—"}`,
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("Resend email notification failed", res.status, await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error("Resend email notification threw", error);
    return false;
  }
}

async function saveToSupabase(values: ContactFormValues) {
  if (!isSupabaseConfigured()) return false;

  try {
    const { getSupabaseAdminClient } = await import("@/lib/supabase/admin");
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: values.name || null,
      phone: values.phone,
      event_type: values.eventType || null,
      event_date: values.eventDate || null,
      message: values.message || null,
    });
    if (error) console.error("Supabase contact_submissions insert failed", error);
    return !error;
  } catch (error) {
    console.error("Supabase contact_submissions insert threw", error);
    return false;
  }
}

export async function submitContactForm(
  values: ContactFormValues
): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "invalid" };
  }

  const [savedToDb, sentToSheets, sentEmail] = await Promise.all([
    saveToSupabase(parsed.data),
    forwardToGoogleSheets(parsed.data),
    sendEmailNotification(parsed.data),
  ]);

  if (savedToDb || sentToSheets || sentEmail) {
    return { success: true };
  }

  return { success: false, error: "delivery_failed" };
}
