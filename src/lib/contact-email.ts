import { Resend } from "resend";
import type { ContactMessageRecord } from "@/lib/contact-schema";

let resendClient: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://zubairrizwan.dev";
}

function fromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? "Muhammad Zubair Rizwan <onboarding@resend.dev>";
}

function contactEmail() {
  return process.env.CONTACT_EMAIL ?? process.env.MY_EMAIL_ADDRESS ?? "zubairfloat@gmail.com";
}

function field(label: string, value?: string | boolean) {
  const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return `
    <tr>
      <td style="padding:10px 0;color:#94a3b8;font-size:13px;width:180px;">${label}</td>
      <td style="padding:10px 0;color:#f8fafc;font-size:14px;font-weight:600;">${escapeHtml(displayValue || "Not provided")}</td>
    </tr>
  `;
}

export async function sendOwnerNotification(message: ContactMessageRecord) {
  const to = contactEmail();
  if (!to) throw new Error("CONTACT_EMAIL is not configured.");

  const resend = getResend();
  const submittedAt = new Date(message.createdAt).toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return resend.emails.send({
    from: fromEmail(),
    to,
    replyTo: message.email,
    subject: `New inquiry: ${message.subject}`,
    html: `
      <div style="margin:0;background:#020617;padding:32px;font-family:Inter,Arial,sans-serif;color:#f8fafc;">
        <div style="max-width:720px;margin:0 auto;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(135deg,rgba(15,23,42,.96),rgba(2,6,23,.96));padding:28px;">
          <p style="margin:0 0 8px;color:#38bdf8;text-transform:uppercase;letter-spacing:.16em;font-size:12px;">New Contact Inquiry</p>
          <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;">${escapeHtml(message.subject)}</h1>
          <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12);margin:18px 0;">
            ${field("Name", message.name)}
            ${field("Email", message.email)}
            ${field("Phone", message.phone)}
            ${field("Company", message.company)}
            ${field("Country", message.country)}
            ${field("Budget", message.budget)}
            ${field("Timeline", message.timeline)}
            ${field("Service", message.service)}
            ${field("Submission Time", submittedAt)}
            ${field("IP Address", message.ip)}
            ${field("Browser", message.browser)}
            ${field("Operating System", message.operatingSystem)}
            ${field("Referrer", message.referrer)}
          </table>
          <div style="border-radius:14px;background:rgba(15,23,42,.9);border:1px solid rgba(255,255,255,.1);padding:18px;">
            <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Message</p>
            <p style="white-space:pre-wrap;margin:0;color:#e2e8f0;line-height:1.7;font-size:15px;">${escapeHtml(message.message)}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendVisitorAutoReply(message: ContactMessageRecord) {
  const resend = getResend();
  const url = siteUrl();

  return resend.emails.send({
    from: fromEmail(),
    to: message.email,
    subject: "Thanks for contacting Muhammad Zubair Rizwan",
    html: `
      <div style="margin:0;background:#020617;padding:32px;font-family:Inter,Arial,sans-serif;color:#f8fafc;">
        <div style="max-width:680px;margin:0 auto;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(135deg,rgba(15,23,42,.98),rgba(2,6,23,.98));overflow:hidden;">
          <div style="padding:30px 30px 12px;">
            <p style="margin:0 0 10px;color:#38bdf8;text-transform:uppercase;letter-spacing:.16em;font-size:12px;">Message Received</p>
            <h1 style="margin:0;font-size:30px;line-height:1.2;">Hi ${escapeHtml(message.name)}, thanks for reaching out.</h1>
            <p style="margin:18px 0 0;color:#cbd5e1;font-size:16px;line-height:1.8;">
              I have received your inquiry about <strong style="color:#f8fafc;">${escapeHtml(message.service)}</strong>.
              I usually respond within 24 hours with next steps, useful questions, or a suggested call time.
            </p>
          </div>
          <div style="padding:18px 30px 30px;">
            <div style="border-radius:16px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.22);padding:18px;margin-bottom:22px;">
              <p style="margin:0;color:#e2e8f0;line-height:1.7;">
                Your message is safely stored in my inquiry system. If this is urgent, you can also book a meeting directly.
              </p>
            </div>
            <div style="display:grid;gap:10px;">
              <a href="${url}" style="color:#38bdf8;text-decoration:none;">Portfolio</a>
              <a href="${url}/resume-builder" style="color:#38bdf8;text-decoration:none;">Resume Builder</a>
              <a href="${url}/learning" style="color:#38bdf8;text-decoration:none;">Learning Hub</a>
              <a href="https://www.linkedin.com/in/muhammad-zubair-rizwan-69a355180/" style="color:#38bdf8;text-decoration:none;">LinkedIn</a>
              <a href="https://github.com/zubairfloat" style="color:#38bdf8;text-decoration:none;">GitHub</a>
              <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? url + "/#contact"}" style="color:#38bdf8;text-decoration:none;">Book a Call</a>
            </div>
            <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.7;">
              Muhammad Zubair Rizwan<br />
              Principal Consultant - Digital Commerce
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
