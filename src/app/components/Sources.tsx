interface Source {
  title: string;
  url?: string;
}

interface SourcesProps {
  sources: Source[];
}

function getDomain(url?: string) {
  if (!url) return null;

  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export default function Sources({ sources }: SourcesProps) {
  if (!sources.length) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div>
          <h2 className="text-sm font-medium text-white">Sources</h2>

          <p className="mt-1 text-xs text-slate-400">
            Documentation used to ground this answer
          </p>
        </div>

        <div className="flex h-7 min-w-7 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 text-xs font-medium text-cyan-400">
          {sources.length}
        </div>
      </div>

      {/* Sources */}
      <div className="divide-y divide-white/[0.05]">
        {sources.map((source, index) => {
          const domain = getDomain(source.url);

          const content = (
            <>
              {/* Number */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-slate-500 transition-colors group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10 group-hover:text-cyan-400">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Source info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
                  {source.title}
                </p>

                {domain && (
                  <p className="mt-1 truncate text-xs text-slate-600">
                    {domain}
                  </p>
                )}
              </div>

              {/* Arrow */}
              {source.url && (
                <svg
                  className="h-4 w-4 shrink-0 text-slate-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 15L15 5M7 5H15V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </>
          );

          if (source.url) {
            return (
              <a
                key={`${source.title}-${index}`}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.025]"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={`${source.title}-${index}`}
              className="flex items-center gap-4 px-6 py-4"
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-6 py-3">
        <p className="text-[11px] text-slate-400">
          Retrieved through your connected documentation
        </p>
      </div>
    </section>
  );
}
