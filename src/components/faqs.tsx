import { FIND_MODEL_TIP, type CategoryId } from "@/data/catalog";
import { type FaqItem, PLACEHOLDER } from "./sections";

/** FAQ content. Answers that depend on business policy stay as labeled placeholders. */
export function sellFaqs(category: CategoryId | null): FaqItem[] {
  const tip = category ? FIND_MODEL_TIP[category] : `${FIND_MODEL_TIP.iphone} On Android phones, open Settings → About phone.`;
  return [
    { id: "which-model", q: "How do I find which model I have?", a: tip },
    {
      q: "How do I describe my device’s condition?",
      a: "You’ll answer four short questions: whether it powers on, whether everything works, whether the front and back are free of cracks, and its overall cosmetic condition. Choose the option that best matches your device today.",
    },
    { q: "Do I need an account to sell?", a: PLACEHOLDER() },
    { q: "What happens after I accept my offer?", a: PLACEHOLDER() },
    { q: "How should I prepare my device before sending it?", a: PLACEHOLDER() },
    { q: "My model isn’t listed. What can I do?", a: PLACEHOLDER() },
  ];
}
