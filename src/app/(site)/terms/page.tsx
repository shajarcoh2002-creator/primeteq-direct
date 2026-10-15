export const metadata = { title: "Terms of Service" };

// Placeholder structure — Prime Teq must supply the actual policy text.
const SECTIONS = ["Offers and how they’re calculated", "Inspection and final amount", "Eligibility", "Shipping", "Payment", "Your data"];

export default function TermsPage() {
  return (
    <section className="bg-paper">
      <div className="container-page py-12 md:py-20">
        <div className="card mx-auto max-w-3xl p-6 md:p-10">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Terms of Service</h1>
          <p className="mt-4 rounded-xl border border-dashed border-line bg-paper p-4 text-sm text-muted">
            Placeholder — the final terms will be provided by Prime Teq. No policy below is in effect yet.
          </p>
          <div className="mt-8 space-y-6">
            {SECTIONS.map((s) => (
              <div key={s}>
                <h2 className="font-display text-lg font-bold">{s}</h2>
                <p className="mt-2 text-sm text-muted">
                  <span className="placeholder-note">Policy text to be confirmed</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
