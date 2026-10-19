import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { CONTACT } from "./contact";

// Outgoing email.
//  - SMTP_USER + SMTP_PASS set → sent through that SMTP server.
//      Google Workspace: SMTP_USER=sales@primeteqdirect.com, SMTP_PASS=app password (host defaults to smtp.gmail.com).
//      Resend: SMTP_HOST=smtp.resend.com, SMTP_USER=resend, SMTP_PASS=API key, EMAIL_FROM=sales@primeteqdirect.com.
//  - Not set, outside Vercel → written to ./data/outbox/*.html so emails can be previewed locally.
//  - Not set on Vercel → skipped; the order history records that no email went out.

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  ok: boolean;
  mode: "smtp" | "outbox" | "disabled";
  detail?: string;
}

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
/** Sender address; defaults to the SMTP login, which works for Gmail. Providers like Resend need it set. */
const from = process.env.EMAIL_FROM || user;
export const emailConfigured = Boolean(user && pass);

type Transport = ReturnType<typeof nodemailer.createTransport>;
const g = globalThis as unknown as { __ptdMail?: Transport };

function transport() {
  if (!g.__ptdMail) {
    g.__ptdMail = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user, pass },
    });
  }
  return g.__ptdMail;
}

export function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3100";
}

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (emailConfigured) {
    try {
      await transport().sendMail({
        from: { name: "Prime Teq", address: from! },
        replyTo: CONTACT.email,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      return { ok: true, mode: "smtp" };
    } catch (e) {
      return { ok: false, mode: "smtp", detail: String((e as Error).message ?? e).slice(0, 200) };
    }
  }
  if (!process.env.VERCEL) {
    const dir = path.join(process.cwd(), "data", "outbox");
    await fs.mkdir(dir, { recursive: true });
    const file = `${new Date().toISOString().replace(/[:.]/g, "-")}-${msg.subject.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.html`;
    await fs.writeFile(path.join(dir, file), `<!-- To: ${msg.to} | Subject: ${msg.subject} -->\n${msg.html}`);
    return { ok: true, mode: "outbox", detail: `data/outbox/${file}` };
  }
  return { ok: false, mode: "disabled", detail: "Email is not configured (SMTP_USER / SMTP_PASS)." };
}
