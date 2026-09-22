import ReactMarkdown from "react-markdown";

interface AnswerProps {
  answer: string;
  isLoading?: boolean;
}

export default function Answer({ answer, isLoading = false }: AnswerProps) {
  if (isLoading && !answer) {
    return (
      <section className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </div>

          <div>
            <p className="text-sm font-medium text-white">Thinking</p>
            <p className="text-xs text-slate-500">
              Searching connected documentation...
            </p>
          </div>
        </div>

        {/* Skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-[92%] animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-3 w-[82%] animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-3 w-[68%] animate-pulse rounded-full bg-white/[0.06]" />
        </div>
      </section>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <section className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.15]">
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60" />

      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Answer</p>
              <p className="text-xs text-slate-600">
                Grounded in connected documentation
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Generating
            </div>
          )}
        </div>

        {/* Answer */}
        <article className="text-[15px] leading-7 text-slate-300">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 mt-6 text-2xl font-semibold tracking-tight text-white first:mt-0">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-white first:mt-0">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-base font-semibold text-cyan-100">
                  {children}
                </h3>
              ),

              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,

              ul: ({ children }) => (
                <ul className="mb-4 ml-5 list-disc space-y-2 marker:text-cyan-400">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-4 ml-5 list-decimal space-y-2 marker:text-cyan-400">
                  {children}
                </ol>
              ),

              li: ({ children }) => <li className="pl-1">{children}</li>,

              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),

              em: ({ children }) => (
                <em className="text-slate-200">{children}</em>
              ),

              code: ({ children }) => (
                <code className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[13px] text-cyan-300">
                  {children}
                </code>
              ),

              pre: ({ children }) => (
                <pre className="my-5 overflow-x-auto rounded-xl border border-white/10 bg-[#020617] p-4 font-mono text-[13px] leading-6 text-slate-300">
                  {children}
                </pre>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-5 border-l-2 border-cyan-400/50 pl-4 text-slate-400">
                  {children}
                </blockquote>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 transition-colors hover:text-cyan-300 hover:decoration-cyan-300"
                >
                  {children}
                </a>
              ),
            }}
          >
            {answer}
          </ReactMarkdown>

          {/* Streaming cursor */}
          {isLoading && (
            <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-sm bg-cyan-400 align-middle shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          )}
        </article>
      </div>
    </section>
  );
}
