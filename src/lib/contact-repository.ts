import postgres from "postgres";
import type { ContactMessageRecord } from "@/lib/contact-schema";

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  budget: string;
  timeline: string;
  service: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: Date;
  ip: string | null;
  browser: string | null;
  operating_system: string | null;
  referrer: string | null;
  user_agent: string | null;
  email_sent: boolean;
  auto_reply_sent: boolean;
};

let sqlClient: ReturnType<typeof postgres> | null = null;
let schemaReady = false;

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!sqlClient) {
    sqlClient = postgres(process.env.DATABASE_URL, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return sqlClient;
}

async function ensureSchema() {
  if (schemaReady) return;

  const sql = getSql();
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      country TEXT,
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      service TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip TEXT,
      browser TEXT,
      operating_system TEXT,
      referrer TEXT,
      user_agent TEXT,
      email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      auto_reply_sent BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS contact_messages_status_created_at_idx
    ON contact_messages (status, created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS contact_messages_email_created_at_idx
    ON contact_messages (email, created_at DESC)
  `;

  schemaReady = true;
}

function mapRow(row: ContactMessageRow): ContactMessageRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    country: row.country ?? undefined,
    budget: row.budget as ContactMessageRecord["budget"],
    timeline: row.timeline as ContactMessageRecord["timeline"],
    service: row.service as ContactMessageRecord["service"],
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    ip: row.ip ?? undefined,
    browser: row.browser ?? undefined,
    operatingSystem: row.operating_system ?? undefined,
    referrer: row.referrer ?? undefined,
    userAgent: row.user_agent ?? undefined,
    emailSent: row.email_sent,
    autoReplySent: row.auto_reply_sent,
  };
}

export async function saveContactMessage(message: ContactMessageRecord) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<ContactMessageRow[]>`
    INSERT INTO contact_messages (
      name, email, phone, company, country, budget, timeline, service,
      subject, message, status, created_at, ip, browser, operating_system,
      referrer, user_agent, email_sent, auto_reply_sent
    )
    VALUES (
      ${message.name}, ${message.email}, ${message.phone ?? null},
      ${message.company ?? null}, ${message.country ?? null}, ${message.budget},
      ${message.timeline}, ${message.service}, ${message.subject},
      ${message.message}, ${message.status}, ${message.createdAt},
      ${message.ip ?? null}, ${message.browser ?? null},
      ${message.operatingSystem ?? null}, ${message.referrer ?? null},
      ${message.userAgent ?? null}, ${message.emailSent ?? false},
      ${message.autoReplySent ?? false}
    )
    RETURNING *
  `;

  return mapRow(rows[0]);
}

export async function updateContactMessageDelivery(
  id: string,
  delivery: Pick<ContactMessageRecord, "emailSent" | "autoReplySent">
) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE contact_messages
    SET email_sent = ${delivery.emailSent ?? false},
        auto_reply_sent = ${delivery.autoReplySent ?? false}
    WHERE id = ${id}
  `;
}

export async function findRecentDuplicate(email: string, message: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<ContactMessageRow[]>`
    SELECT *
    FROM contact_messages
    WHERE email = ${email}
      AND message = ${message}
      AND created_at > NOW() - INTERVAL '10 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function listContactMessages({
  status,
  search,
  limit = 25,
  offset = 0,
}: {
  status?: ContactMessageRecord["status"];
  search?: string;
  limit?: number;
  offset?: number;
}) {
  await ensureSchema();
  const sql = getSql();
  const query = `%${search ?? ""}%`;
  const rows = await sql<ContactMessageRow[]>`
    SELECT *
    FROM contact_messages
    WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (
        ${search ?? null}::text IS NULL
        OR name ILIKE ${query}
        OR email ILIKE ${query}
        OR subject ILIKE ${query}
        OR message ILIKE ${query}
      )
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return rows.map(mapRow);
}

export async function setContactMessageStatus(id: string, status: ContactMessageRecord["status"]) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE contact_messages
    SET status = ${status}
    WHERE id = ${id}
  `;
}

export async function deleteContactMessage(id: string) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    DELETE FROM contact_messages
    WHERE id = ${id}
  `;
}
