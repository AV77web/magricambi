import Image from "next/image";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/src/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

function getSafeRedirectTo(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "/");

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  try {
    const parsed = new URL(raw);

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

async function login(formData: FormData) {
  "use server";

  const identifier = String(formData.get("identifier") ?? "").trim();

  console.log("[login-page] Submit login ricevuto", {
    hasIdentifier: Boolean(identifier),
    hasPassword: Boolean(formData.get("password")),
  });

  try {
    await signIn("credentials", {
      identifier,
      password: formData.get("password"),
      redirectTo: getSafeRedirectTo(formData.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("[login-page] AuthError durante login", {
        type: error.type,
        cause: error.cause,
      });
      redirect("/login?error=CredentialsSignin");
    }

    console.error("[login-page] Errore inatteso durante login", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const hasError = params?.error === "CredentialsSignin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="relative h-48 w-full bg-zinc-100">
          <Image
            src="/images/Home.jpg"
            alt="MagRicambi"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 384px"
          />
        </div>

        <div className="p-6">
          <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-950">Accesso</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Entra in MagRicambi con utente o email.
          </p>
          </div>

          {hasError ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Credenziali non valide oppure utente non attivo.
            </p>
          ) : null}

          <form action={login} className="space-y-4">
            <input
              type="hidden"
              name="callbackUrl"
              value={params?.callbackUrl ?? "/"}
            />

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Utente o email</span>
              <input
                required
                autoComplete="username"
                name="identifier"
                type="text"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none transition-colors focus:border-zinc-900"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Password</span>
              <input
                required
                autoComplete="current-password"
                name="password"
                type="password"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none transition-colors focus:border-zinc-900"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-zinc-950 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Accedi
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
