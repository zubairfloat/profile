import type { ContactMessageRecord } from "@/lib/contact-schema";
import {
  deleteContactMessage,
  listContactMessages,
  setContactMessageStatus,
} from "@/lib/contact-repository";

export async function getUnreadContactMessages(limit = 25, offset = 0) {
  return listContactMessages({ status: "unread", limit, offset });
}

export async function searchContactMessages({
  query,
  status,
  page = 1,
  pageSize = 25,
}: {
  query?: string;
  status?: ContactMessageRecord["status"];
  page?: number;
  pageSize?: number;
}) {
  return listContactMessages({
    search: query,
    status,
    limit: pageSize,
    offset: Math.max(0, page - 1) * pageSize,
  });
}

export async function markContactMessageAsRead(id: string) {
  return setContactMessageStatus(id, "read");
}

export async function archiveContactMessage(id: string) {
  return setContactMessageStatus(id, "archived");
}

export async function removeContactMessage(id: string) {
  return deleteContactMessage(id);
}

function csvCell(value?: string | boolean) {
  const normalized = String(value ?? "");
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function contactMessagesToCsv(messages: ContactMessageRecord[]) {
  const headers = [
    "id",
    "name",
    "email",
    "phone",
    "company",
    "country",
    "budget",
    "timeline",
    "service",
    "subject",
    "message",
    "status",
    "createdAt",
    "ip",
    "browser",
    "referrer",
    "emailSent",
    "autoReplySent",
  ];

  const rows = messages.map((message) => [
    message.id,
    message.name,
    message.email,
    message.phone,
    message.company,
    message.country,
    message.budget,
    message.timeline,
    message.service,
    message.subject,
    message.message,
    message.status,
    message.createdAt,
    message.ip,
    message.browser,
    message.referrer,
    message.emailSent,
    message.autoReplySent,
  ]);

  return [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
}
