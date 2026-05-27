export default function MachinePage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            Macchine
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gestione del parco macchine e attrezzature
          </p>
        </header>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            Contenuto della pagina macchine in arrivo...
          </p>
        </div>
      </div>
    </div>
  );
}
