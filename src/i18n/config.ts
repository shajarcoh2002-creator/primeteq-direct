export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];
/** Spanish is the default; customers can switch to English from the header. */
export const DEFAULT_LANG: Lang = "es";
export const LANG_COOKIE = "ptd_lang";

export const isLang = (v: unknown): v is Lang => v === "es" || v === "en";

/** Fills {name} placeholders: fmt("Step {n} of {total}", { n: 1, total: 4 }). */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
