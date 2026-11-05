import type { Answers, Condition, Cracks } from "./pricing";
import { conditionFromAnswers } from "./pricing";

const COSMETIC = ["flawless", "good", "fair", "poor"] as const;
/** n= in the URL: 1 no cracks, f front, b back, 0 both (0 was “cracked” before the split). */
const CRACKS: Record<string, Cracks> = { "1": "none", f: "front", b: "back", "0": "both" };
export const CRACK_PARAM: Record<Cracks, string> = { none: "1", front: "f", back: "b", both: "0" };

/** Parse questionnaire answers from query/form values (p, f, n, k). */
export function parseAnswers(get: (key: string) => string | null | undefined): { answers: Answers; condition: Condition } | null {
  const powersOn = get("p") === "1";
  const functional = powersOn && get("f") === "1";
  const cracks = functional ? CRACKS[get("n") ?? ""] : undefined;
  const noCracks = cracks === "none";
  const k = get("k");
  const cosmetic = noCracks && COSMETIC.includes(k as (typeof COSMETIC)[number]) ? (k as Answers["cosmetic"]) : null;
  const answers: Answers = { powersOn, functional, noCracks, cracks, cosmetic };
  const condition = conditionFromAnswers(answers);
  return condition ? { answers, condition } : null;
}
