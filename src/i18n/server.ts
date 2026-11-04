import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./config";
import { en, type Dict } from "./en";
import { es } from "./es";

const DICTS: Record<Lang, Dict> = { es, en };

export const dictFor = (lang: Lang): Dict => DICTS[lang];

/** Current visitor language from the ptd_lang cookie (Spanish by default). */
export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getDict(): Promise<Dict> {
  return DICTS[await getLang()];
}
