"use server";

import { contactSchema, type ContactFormValues } from "@/lib/contact-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitContact(values: ContactFormValues): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Please fix the highlighted fields.";
    return {
      success: false,
      error: firstError,
    };
  }

  const data = parsed.data;

  if (data.honeypot) {
    return {
      success: false,
      error: "Spam protection triggered.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      country: data.country || null,
      budget: data.budget,
      timeline: data.timeline,
      service: data.service,
      subject: data.subject,
      message: data.message,
      status: "new",
    });

    if (error) {
      console.error("contact.supabase_insert_failed", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return {
        success: false,
        error: "Unable to save your message right now. Please try again shortly.",
      };
    }

    console.info("contact.supabase_insert_success", {
      email: data.email,
      service: data.service,
      budget: data.budget,
      timeline: data.timeline,
    });

    return { success: true };
  } catch (error) {
    console.error("contact.submit_failed", error);

    return {
      success: false,
      error: "Something went wrong while saving your message. Please try again.",
    };
  }
}
