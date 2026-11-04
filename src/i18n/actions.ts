"use server";

import { cookies } from "next/headers";
import { LANG_COOKIE, isLang } from "./config";

/** Saves the visitor's language for a year. */
export async function setLang(lang: string) {
  if (!isLang(lang)) return;
  (await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
