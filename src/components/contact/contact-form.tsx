"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { submitContactForm } from "@/actions/contact";
import type { EventType } from "@/types";

export function ContactForm({ eventTypes }: { eventTypes: EventType[] }) {
  const t = useTranslations("form");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", phone: "", eventDate: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    const result = await submitContactForm(values);
    if (result.success) {
      setSubmitted(true);
      reset();
      toast.success(t("success"));
    } else {
      toast.error(t("error"));
    }
  };

  if (submitted) {
    return (
      <div className="border border-accent/30 bg-cream px-6 py-10 text-center">
        <p className="font-serif text-2xl">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("name")}{" "}
            <span className="text-xs normal-case text-muted-foreground">({t("optional")})</span>
          </Label>
          <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{t("requiredError")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventType">
            {t("eventType")}{" "}
            <span className="text-xs normal-case text-muted-foreground">({t("optional")})</span>
          </Label>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder={t("eventTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">
            {t("eventDate")}{" "}
            <span className="text-xs normal-case text-muted-foreground">({t("optional")})</span>
          </Label>
          <Input id="eventDate" type="date" {...register("eventDate")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          {t("message")}{" "}
          <span className="text-xs normal-case text-muted-foreground">({t("optional")})</span>
        </Label>
        <Textarea id="message" placeholder={t("messagePlaceholder")} {...register("message")} />
      </div>

      <Button type="submit" size="lg" variant="gold" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
