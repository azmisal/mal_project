"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { waitlistFormSchema } from "@/lib/validation";
import { REFERRAL_SOURCES, REFERRAL_SOURCE_LABELS } from "@/types/waitlist";

type FieldErrors = Partial<Record<"fullName" | "email" | "phone" | "referralSource", string>>;

export function WaitlistForm() {
  const [contactMethod, setContactMethod] = React.useState<"email" | "phone">("email");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [referralSource, setReferralSource] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const result = waitlistFormSchema.safeParse({
      fullName,
      contactMethod,
      email,
      phone,
      referralSource,
      market: "pakistan",
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setFormError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setFormError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-muted px-6 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold">You&apos;re on the list!</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email or text you as soon as Mal launches in Pakistan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName" name="fullName" autoComplete="name" placeholder="Ayesha Khan"
          value={fullName} onChange={(e) => setFullName(e.target.value)}
          hasError={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && <p id="fullName-error" className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex gap-4 text-sm font-medium">
          <button type="button" onClick={() => setContactMethod("email")}
            className={contactMethod === "email" ? "text-primary underline underline-offset-4" : "text-muted-foreground"}>
            Use email
          </button>
          <button type="button" onClick={() => setContactMethod("phone")}
            className={contactMethod === "phone" ? "text-primary underline underline-offset-4" : "text-muted-foreground"}>
            Use phone
          </button>
        </div>

        {contactMethod === "email" ? (
          <>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              hasError={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <p id="email-error" className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </>
        ) : (
          <>
            <Label htmlFor="phone" className="sr-only">Phone number</Label>
            <Input
              id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+923001234567"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              hasError={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && <p id="phone-error" className="mt-1 text-sm text-destructive">{errors.phone}</p>}
          </>
        )}
      </div>

      <div>
        <Label htmlFor="referralSource">How did you hear about us?</Label>
        <Select
          id="referralSource" name="referralSource"
          value={referralSource} onChange={(e) => setReferralSource(e.target.value)}
          hasError={!!errors.referralSource}
          aria-describedby={errors.referralSource ? "referralSource-error" : undefined}
        >
          <option value="" disabled>Select one</option>
          {REFERRAL_SOURCES.map((source) => (
            <option key={source} value={source}>{REFERRAL_SOURCE_LABELS[source]}</option>
          ))}
        </Select>
        {errors.referralSource && <p id="referralSource-error" className="mt-1 text-sm text-destructive">{errors.referralSource}</p>}
      </div>

      {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Joining...</>) : "Join the waitlist"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        No spam. We&apos;ll only contact you about Mal&apos;s launch in Pakistan.
      </p>
    </form>
  );
}