export const metadata = { title: "Terms & price promise" };

// Draft terms — have a lawyer review before launch.
export default function TermsPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Terms &amp; price promise</h1>
        <p className="rounded-lg bg-amber-50 p-3 text-amber-800">Draft — to be reviewed before launch.</p>
        <h2 className="text-lg font-bold text-ink">Price promise</h2>
        <p>
          We will pay the amount in your offer if the device you send matches the model, storage, carrier and condition you selected, and it arrives
          before your offer expires (30 days after you accept it).
        </p>
        <h2 className="text-lg font-bold text-ink">If your device doesn&apos;t match</h2>
        <p>
          If the device is in better condition, we raise your offer. If it doesn&apos;t match your description, we send you a revised offer. You may
          accept it, or we return the device to you free of charge.
        </p>
        <h2 className="text-lg font-bold text-ink">Eligibility</h2>
        <p>
          We do not purchase devices that are reported lost or stolen, blacklisted, under unpaid financing, or with an activation lock (Find My,
          Google FRP) enabled. Accessories are not purchased and will not be returned.
        </p>
        <h2 className="text-lg font-bold text-ink">Your data</h2>
        <p>Please erase your device before shipping. Any data left on received devices is wiped as part of our inspection.</p>
      </div>
    </section>
  );
}
