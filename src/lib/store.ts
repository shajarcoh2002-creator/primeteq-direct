import { promises as fs } from "fs";
import path from "path";

// Simple JSON-file storage in ./data. Fine for local use and a single server;
// swap for a real database (e.g. Postgres) before deploying to serverless hosting.
const DATA_DIR = path.join(process.cwd(), "data");

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, target);
}
