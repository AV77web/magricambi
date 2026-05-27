import { redirect } from "next/navigation";

import { auth } from "@/src/auth";

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-500">Area gestionale</p>
            <p className="text-base font-semibold text-zinc-950">
              {session.user.utente}
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
