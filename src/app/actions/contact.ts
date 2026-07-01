"use server";

import { headers } from "next/headers";
import type { ZodError } from "zod";
import { contactSchema, type ContactFormValues, type ContactMessageRecord } from "@/lib/contact-schema";
import { getClientIp, parseBrowser, parseOperatingSystem } from "@/lib/contact-metadata";
import {
  findRecentDuplicate,
  saveContactMessage,
  updateContactMessageDelivery,
} from "@/lib/contact-repository";
import { sendOwnerNotification, sendVisitorAutoReply } from "@/lib/contact-email";

export type ContactActionResult = {
  ok: boolean;
  saved: boolean;
  emailSent: boolean;
  autoReplySent: boolean;
  message: string;
  retryable?: boolean;
  errors?: Partial<Record<keyof ContactFormValues, string>>;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const MIN_TYPING_TIME_MS = 3_000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function formErrors(error: ZodError<ContactFormValues>): ContactActionResult["errors"] {
  const flattened = error.flatten();
  return Object.fromEntries(
    Object.entries(flattened.fieldErrors).map(([key, value]) => [key, value?.[0]])
  ) as ContactActionResult["errors"];
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) return false;

  current.count += 1;
  rateLimitStore.set(key, current);
  return true;
}

export async function submitContactInquiry(values: ContactFormValues): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      saved: false,
      emailSent: false,
      autoReplySent: false,
      message: "Please fix the highlighted fields.",
      errors: formErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const userAgent = headersList.get("user-agent") ?? undefined;
  const referrer = headersList.get("referer") ?? undefined;
  const browser = parseBrowser(userAgent);
  const operatingSystem = parseOperatingSystem(userAgent);
  const rateLimitKey = ip ?? data.email.toLowerCase();

  if (data.honeypot) {
    return {
      ok: false,
      saved: false,
      emailSent: false,
      autoReplySent: false,
      message: "Spam protection triggered.",
    };
  }

  if (data.startedAt && Date.now() - data.startedAt < MIN_TYPING_TIME_MS) {
    return {
      ok: false,
      saved: false,
      emailSent: false,
      autoReplySent: false,
      message: "Please take a moment to complete the form before submitting.",
    };
  }

  if (!checkRateLimit(rateLimitKey)) {
    return {
      ok: false,
      saved: false,
      emailSent: false,
      autoReplySent: false,
      message: "Too many submissions. Please try again in a minute.",
      retryable: true,
    };
  }

  try {
    const duplicate = await findRecentDuplicate(data.email, data.message);
    if (duplicate) {
      if (!duplicate.emailSent || !duplicate.autoReplySent) {
        let retriedOwnerEmail = duplicate.emailSent ?? false;
        let retriedAutoReply = duplicate.autoReplySent ?? false;

        try {
          if (!retriedOwnerEmail) {
            await sendOwnerNotification(duplicate);
            retriedOwnerEmail = true;
          }
        } catch (error) {
          console.error("contact.duplicate_owner_email_retry_failed", error);
        }

        try {
          if (!retriedAutoReply) {
            await sendVisitorAutoReply(duplicate);
            retriedAutoReply = true;
          }
        } catch (error) {
          console.error("contact.duplicate_auto_reply_retry_failed", error);
        }

        if (duplicate.id) {
          try {
            await updateContactMessageDelivery(duplicate.id, {
              emailSent: retriedOwnerEmail,
              autoReplySent: retriedAutoReply,
            });
          } catch (error) {
            console.error("contact.duplicate_delivery_update_failed", error);
          }
        }

        return {
          ok: retriedOwnerEmail && retriedAutoReply,
          saved: true,
          emailSent: retriedOwnerEmail,
          autoReplySent: retriedAutoReply,
          message:
            retriedOwnerEmail && retriedAutoReply
              ? "Thanks for reaching out! I've received your inquiry and will respond within 24 hours."
              : "Your message has been safely saved. Email delivery is still having trouble, but we'll contact you shortly.",
          retryable: !(retriedOwnerEmail && retriedAutoReply),
        };
      }

      return {
        ok: true,
        saved: true,
        emailSent: duplicate.emailSent ?? false,
        autoReplySent: duplicate.autoReplySent ?? false,
        message: "This inquiry was already received recently. I will respond shortly.",
      };
    }
  } catch (error) {
    console.error("contact.duplicate_check_failed", error);
  }

  const record: ContactMessageRecord = {
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    company: data.company || undefined,
    country: data.country || undefined,
    budget: data.budget,
    timeline: data.timeline,
    service: data.service,
    subject: data.subject,
    message: data.message,
    status: "unread",
    createdAt: new Date().toISOString(),
    ip,
    browser,
    operatingSystem,
    referrer,
    userAgent,
    emailSent: false,
    autoReplySent: false,
  };

  let savedRecord: ContactMessageRecord;
  try {
    savedRecord = await saveContactMessage(record);
  } catch (error) {
    console.error("contact.save_failed", error);
    return {
      ok: false,
      saved: false,
      emailSent: false,
      autoReplySent: false,
      message: "Something went wrong while saving your inquiry. Please try again.",
      retryable: true,
    };
  }

  let emailSent = false;
  let autoReplySent = false;

  try {
    await sendOwnerNotification(savedRecord);
    emailSent = true;
  } catch (error) {
    console.error("contact.owner_email_failed", error);
  }

  try {
    await sendVisitorAutoReply(savedRecord);
    autoReplySent = true;
  } catch (error) {
    console.error("contact.auto_reply_failed", error);
  }

  if (savedRecord.id) {
    try {
      await updateContactMessageDelivery(savedRecord.id, { emailSent, autoReplySent });
    } catch (error) {
      console.error("contact.delivery_update_failed", error);
    }
  }

  console.info("contact.submitted", {
    id: savedRecord.id,
    email: savedRecord.email,
    service: savedRecord.service,
    budget: savedRecord.budget,
    timeline: savedRecord.timeline,
    ip: savedRecord.ip,
    emailSent,
    autoReplySent,
  });

  if (!emailSent || !autoReplySent) {
    return {
      ok: false,
      saved: true,
      emailSent,
      autoReplySent,
      message: "Something went wrong while sending the email. Your message has been safely saved. We'll contact you shortly.",
      retryable: true,
    };
  }

  return {
    ok: true,
    saved: true,
    emailSent,
    autoReplySent,
    message: "Thanks for reaching out! I've received your inquiry and will respond within 24 hours.",
  };
}
