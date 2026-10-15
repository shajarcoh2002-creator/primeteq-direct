import { ArrowRight } from "lucide-react";
import { Stepper } from "@/components/FlowBar";
import { ClosingCta, Faq, PLACEHOLDER } from "@/components/sections";

export const metadata = { title: "UI states", robots: { index: false } };

const SWATCHES = [
  { name: "Prime navy", hex: "#0B1640", cls: "bg-ink", note: "Headings, footer, high-contrast" },
  { name: "Electric blue", hex: "#342CFF", cls: "bg-brand", note: "Primary CTA, selected states" },
  { name: "White", hex: "#FFFFFF", cls: "bg-white border border-line", note: "Canvas and cards" },
  { name: "Cool background", hex: "#F5F7FB", cls: "bg-paper border border-line", note: "Alternate sections" },
  { name: "Fine border", hex: "#E2E7F0", cls: "bg-line", note: "Controls and dividers" },
  { name: "Secondary text", hex: "#5B6475", cls: "bg-muted", note: "Supporting copy" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-muted">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function StateCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-muted">{label}</p>
      {children}
    </div>
  );
}

export default function StyleGuide() {
  return (
    <>
      <div className="container-page py-12">
        <p className="eyebrow">Prime Teq · Sell experience</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">UI states &amp; tokens</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Reference for the visual system used across the configurator. Color values are proposal tokens from the visual brief; the logo itself is
          never recolored (measured logo colors: navy #031842, blue #2220FB).
        </p>

        <Block title="Color tokens">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SWATCHES.map((s) => (
              <div key={s.name}>
                <div className={`h-20 rounded-2xl ${s.cls}`} />
                <p className="mt-2 text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted">{s.hex} · {s.note}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography">
          <div className="space-y-3">
            <p className="font-display text-[34px] font-extrabold leading-tight md:text-[60px]">Sell your <span className="text-brand">iPhone</span>.</p>
            <p className="font-display text-3xl font-extrabold">Section heading — Manrope ExtraBold</p>
            <p className="text-lg text-muted">Body large — Inter 18px. Find your model and see your offer.</p>
            <p>Body — Inter 16px for forms, labels and supporting text.</p>
            <p className="eyebrow">Eyebrow label</p>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
            <button className="btn btn-primary" aria-disabled="true">Continue (disabled)</button>
            <button className="btn btn-secondary">Back</button>
            <span className="rounded-2xl bg-ink p-3"><button className="btn btn-on-dark">On navy</button></span>
          </div>
        </Block>

        <Block title="Configurator option — states">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StateCol label="Default">
              <button type="button" className="option w-full"><span className="option-dot" />Unlocked</button>
            </StateCol>
            <StateCol label="Selected">
              <button type="button" className="option w-full" data-selected="true"><span className="option-dot" />Unlocked</button>
            </StateCol>
            <StateCol label="Error">
              <button type="button" className="option w-full" data-invalid="true"><span className="option-dot" />Unlocked</button>
              <p className="mt-2 text-sm font-medium text-danger">Please choose a carrier.</p>
            </StateCol>
            <StateCol label="Disabled">
              <button type="button" className="option w-full" disabled><span className="option-dot" />Unlocked</button>
            </StateCol>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <StateCol label="Text field — default">
              <input className="field" placeholder="Email" />
            </StateCol>
            <StateCol label="Text field — error">
              <input className="field" aria-invalid="true" defaultValue="name@" />
              <p className="mt-1.5 text-sm font-medium text-danger">Please enter a valid email address.</p>
            </StateCol>
          </div>
        </Block>

        <Block title="Progress indicator">
          <div className="space-y-2 rounded-2xl border border-line p-4 md:p-6">
            <Stepper current={0} />
            <Stepper current={1} />
            <Stepper current={2} />
          </div>
          <p className="mt-3 text-sm text-muted">On phones the stepper collapses to “Step X of 4” with a segmented bar.</p>
        </Block>

        <Block title="Placeholder marker">
          <p className="text-sm text-muted">Used wherever a business policy hasn’t been confirmed: {PLACEHOLDER("Policy to be confirmed")}</p>
        </Block>
      </div>

      <Faq
        title="Accordion"
        items={[
          { q: "Collapsed item", a: "Expanded content uses secondary text on white." },
          { q: "Another question", a: PLACEHOLDER() },
        ]}
      />
      <ClosingCta href="/sell/iphone" label="Choose your iPhone" />
    </>
  );
}
