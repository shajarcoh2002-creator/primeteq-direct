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
    postgresEnvVarNames: postgresVars,
  });
}
