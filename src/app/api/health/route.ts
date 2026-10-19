import { emailConfigured, siteUrl } from "@/lib/email";
import { checkDatabase, storageKind } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Configuration check. Reports only whether settings exist and work — never their values. */
export async function GET() {
  const db = await checkDatabase();
  const postgresVars = Object.entries(process.env)
    .filter(([, v]) => typeof v === "string" && /^postgres(ql)?:\/\//.test(v))
    .map(([k]) => k)
    .sort();
  return Response.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    storage: storageKind,
    database: db,
    adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD),
    emailConfigured,
    siteUrl: siteUrl(),
    // Names only (never values) of email-related variables, to spot typos or missing environments.
    emailEnvVarNames: Object.keys(process.env).filter((k) => /SMTP|MAIL/i.test(k)).sort(),
    postgresEnvVarNames: postgresVars,
  });
}
