import type { Answers, Condition } from "./pricing";
import { conditionFromAnswers } from "./pricing";

const COSMETIC = ["flawless", "good", "fair", "poor"] as const;

/** Parse questionnaire answers from query/form values (p, f, n, k). */
export function parseAnswers(get: (key: string) => string | null | undefined): { answers: Answers; condition: Condition } | null {
  const powersOn = get("p") === "1";
  const functional = powersOn && get("f") === "1";
  const noCracks = functional && get("n") === "1";
  const k = get("k");
  const cosmetic = noCracks && COSMETIC.includes(k as (typeof COSMETIC)[number]) ? (k as Answers["cosmetic"]) : null;
  const answers: Answers = { powersOn, functional, noCracks, cosmetic };
  const condition = conditionFromAnswers(answers);
  return condition ? { answers, condition } : null;
}
