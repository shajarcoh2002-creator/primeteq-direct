import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ptd_admin";

function password() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD is not set (see .env.example)");
  return p;
}

function token() {
  return createHmac("sha256", password()).update("primeteq-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && safeEqual(value, token());
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(input: string) {
  if (!safeEqual(input, password())) return false;
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
