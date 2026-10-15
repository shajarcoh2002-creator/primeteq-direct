import { redirect } from "next/navigation";
import { getOrder } from "@/lib/db";

export const metadata = { title: "Track your offer" };

async function track(form: FormData) {
  "use server";
  const id = String(form.get("id") ?? "").trim().toUpperCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const order = id ? await getOrder(id) : null;
  if (!order || order.customer.email !== email) redirect("/track?error=1");
  redirect(`/order/${order.id}`);
}

export default async function TrackPage({ searchParams }: PageProps<"/track">) {
  const error = (await searchParams).error === "1";
  return (
    <section className="bg-paper">
      <div className="container-page py-12 md:py-20">
        <div className="card mx-auto max-w-md p-6 md:p-8">
          <p className="eyebrow">Track offer</p>
          <h1 className="mt-2 text-3xl font-extrabold">Find your order.</h1>
          <p className="mt-2 text-muted">Enter the order number you received when you accepted your offer.</p>
          <form action={track} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="id">Order number</label>
              <input id="id" name="id" placeholder="PT-XXXXXXXX" className="field uppercase" aria-invalid={error || undefined} required />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="field" aria-invalid={error || undefined} required />
            </div>
            {error && (
              <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-3 text-sm font-medium text-danger">
                We couldn&apos;t find an order with that number and email.
              </p>
            )}
            <button className="btn btn-primary w-full">Track</button>
          </form>
        </div>
      </div>
    </section>
  );
}
