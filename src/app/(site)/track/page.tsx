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
    <section className="container-page py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Track your offer</h1>
        <p className="mt-2 text-muted">Enter the order number from your confirmation email.</p>
        <form action={track} className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="id">Order number</label>
            <input id="id" name="id" placeholder="PT-XXXXXXXX" className="field uppercase" required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="field" required />
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">We couldn&apos;t find an order with that number and email.</p>}
          <button className="btn btn-primary w-full">Track</button>
        </form>
      </div>
    </section>
  );
}
