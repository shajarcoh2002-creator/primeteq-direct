import { redirect } from "next/navigation";
import { getOrder } from "@/lib/db";
import { getDict } from "@/i18n/server";

export async function generateMetadata() {
  return { title: (await getDict()).meta.track };
}

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
  const t = (await getDict()).track;
  return (
    <section className="bg-paper">
      <div className="container-page py-12 md:py-20">
        <div className="card mx-auto max-w-md p-6 md:p-8">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold">{t.title}</h1>
          <p className="mt-2 text-muted">{t.lead}</p>
          <form action={track} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="id">{t.orderNumber}</label>
              <input id="id" name="id" placeholder="PT-XXXXXXXX" className="field uppercase" aria-invalid={error || undefined} required />
            </div>
            <div>
              <label className="label" htmlFor="email">{t.email}</label>
              <input id="email" name="email" type="email" className="field" aria-invalid={error || undefined} required />
            </div>
            {error && (
              <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-3 text-sm font-medium text-danger">
                {t.notFound}
              </p>
            )}
            <button className="btn btn-primary w-full">{t.submit}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
