import { redirect } from "next/navigation";
import { login } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Admin" };

async function submit(form: FormData) {
  "use server";
  const ok = await login(String(form.get("password") ?? ""));
  redirect(ok ? "/admin" : "/admin/login?error=1");
}

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const error = (await searchParams).error === "1";
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4">
      <form action={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-line bg-white p-8">
        <Logo />
        <h1 className="text-xl font-bold">Panel de administración</h1>
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" className="field" autoFocus required />
        </div>
        {error && <p className="text-sm font-medium text-red-700">Contraseña incorrecta.</p>}
        <button className="btn btn-primary w-full">Entrar</button>
      </form>
    </main>
  );
}
