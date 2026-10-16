import { promises as fs } from "fs";
import path from "path";
import postgres from "postgres";

// Storage driver.
//  - DATABASE_URL set → Postgres (production; e.g. Neon or Supabase via Vercel).
//  - Otherwise → JSON files in ./data (local development only).
//
// Two kinds of data: small JSON "docs" (pricing settings, resale overrides, calibration refs)
// and orders (one row each).

export interface StoredOrder {
  id: string;
  createdAt: string;
  status: string;
  customer: { email: string };
}

// DATABASE_URL is the default name; Vercel's storage integrations may add a prefix (STORAGE_URL)
// or use Vercel Postgres-style names (POSTGRES_URL).
const DATABASE_URL = process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL;

// On Vercel the filesystem is read-only, so data needs a database. Fail on first use (not at import),
// so the build and static pages still work before the database is connected.
function assertStorageAvailable() {
  if (!DATABASE_URL && process.env.VERCEL) {
    throw new Error("DATABASE_URL is required in production (Vercel). Connect a Postgres database to the project.");
  }
}

// ---------- Postgres ----------

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __ptdSql?: Sql; __ptdSchema?: Promise<void> };

function sql(): Sql {
  if (!g.__ptdSql) {
    // prepare:false keeps it compatible with transaction-mode poolers (Neon / Supabase).
    g.__ptdSql = postgres(DATABASE_URL!, { max: 3, prepare: false, idle_timeout: 20 });
  }
  return g.__ptdSql;
}

function ensureSchema() {
  if (!g.__ptdSchema) {
    const db = sql();
    g.__ptdSchema = (async () => {
      await db`create table if not exists app_kv (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      )`;
      await db`create table if not exists orders (
        id text primary key,
        created_at timestamptz not null,
        status text not null,
        email text not null,
        data jsonb not null,
        updated_at timestamptz not null default now()
      )`;
      await db`create index if not exists orders_created_idx on orders (created_at desc)`;
    })().catch((e) => {
      g.__ptdSchema = undefined;
      throw e;
    });
  }
  return g.__ptdSchema;
}

// ---------- Files (local dev) ----------

const DATA_DIR = path.join(process.cwd(), "data");

async function readFile<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeFile(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, target);
}

// ---------- Public API ----------

export const storageKind = DATABASE_URL ? "postgres" : "files";

export async function getDoc<T>(key: string, fallback: T): Promise<T> {
  assertStorageAvailable();
  if (!DATABASE_URL) return readFile(`${key}.json`, fallback);
  await ensureSchema();
  const rows = await sql()`select value from app_kv where key = ${key}`;
  return rows.length ? (rows[0].value as T) : fallback;
}

export async function setDoc(key: string, value: unknown) {
  assertStorageAvailable();
  if (!DATABASE_URL) return writeFile(`${key}.json`, value);
  await ensureSchema();
  const json = sql().json(value as Parameters<Sql["json"]>[0]);
  await sql()`insert into app_kv (key, value) values (${key}, ${json})
    on conflict (key) do update set value = excluded.value, updated_at = now()`;
}

export async function listOrders<T extends StoredOrder>(): Promise<T[]> {
  assertStorageAvailable();
  if (!DATABASE_URL) {
    const orders = await readFile<T[]>("orders.json", []);
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  await ensureSchema();
  const rows = await sql()`select data from orders order by created_at desc`;
  return rows.map((r) => r.data as T);
}

export async function findOrder<T extends StoredOrder>(id: string): Promise<T | null> {
  assertStorageAvailable();
  if (!DATABASE_URL) return (await listOrders<T>()).find((o) => o.id === id) ?? null;
  await ensureSchema();
  const rows = await sql()`select data from orders where id = ${id}`;
  return rows.length ? (rows[0].data as T) : null;
}

export async function upsertOrder<T extends StoredOrder>(order: T) {
  assertStorageAvailable();
  if (!DATABASE_URL) {
    const orders = await readFile<T[]>("orders.json", []);
    const i = orders.findIndex((o) => o.id === order.id);
    if (i >= 0) orders[i] = order;
    else orders.push(order);
    return writeFile("orders.json", orders);
  }
  await ensureSchema();
  const json = sql().json(order as unknown as Parameters<Sql["json"]>[0]);
  await sql()`insert into orders (id, created_at, status, email, data)
    values (${order.id}, ${order.createdAt}, ${order.status}, ${order.customer.email}, ${json})
    on conflict (id) do update set status = excluded.status, email = excluded.email, data = excluded.data, updated_at = now()`;
}

/** Connectivity check for /api/health — never returns credentials. */
export async function checkDatabase(): Promise<{ configured: boolean; ok: boolean; error?: string }> {
  if (!DATABASE_URL) return { configured: false, ok: false };
  try {
    await ensureSchema();
    await sql()`select 1`;
    return { configured: true, ok: true };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const message = (err.message ?? "unknown error").replace(/\S+@\S+/g, "[redacted]").slice(0, 200);
    return { configured: true, ok: false, error: [err.code, message].filter(Boolean).join(": ") };
  }
}
