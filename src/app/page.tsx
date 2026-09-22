import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Cyan glow */}
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px] animate-pulse" />

        {/* Blue glow */}
        <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_75%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <header className="animate-fade-in-up mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

            <p className="text-xl font-semibold uppercase tracking-[0.25em] text-cyan-400">
              DevDocs
            </p>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            Make better{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              frontend decisions.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Ask about React, Next.js. Get answers grounded in your connected
            official documentation.
          </p>

          {/* Knowledge indicator */}
          <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              React
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              Next.js
            </span>

            <span className="mx-1 text-slate-700">•</span>

            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Documentation connected
            </span>
          </div>
        </header>

        {/* Chat */}
        <section className="animate-fade-in-up-delay">
          <Chat />
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center text-xs text-slate-600">
          <p>Answers grounded in connected documentation</p>

          <p className="mt-2">
            Powered by{" "}
            <a
              href="https://www.sanity.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition-colors hover:text-cyan-400"
            >
              Sanity
            </a>
            <span className="mx-1.5 text-slate-700">·</span>
            <span className="text-slate-500">Context + MCP</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
