import { Fragment } from "react";

/** Like fmt(), but placeholders can be React nodes (links, bold text). */
export function rich(template: string, vars: Record<string, React.ReactNode>) {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = part.match(/^\{(\w+)\}$/);
    return <Fragment key={i}>{m && m[1] in vars ? vars[m[1]] : part}</Fragment>;
  });
}
