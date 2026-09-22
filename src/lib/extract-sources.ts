interface Source {
  title: string;
  url?: string;
}

export function extractSources(steps: unknown[]): Source[] {
  const sources: Source[] = [];

  for (const step of steps) {
    const toolResults = (
      step as {
        toolResults?: unknown[];
      }
    ).toolResults;

    if (!toolResults) continue;

    for (const toolResult of toolResults) {
      const output = (
        toolResult as {
          output?: unknown;
        }
      ).output;

      if (!output || typeof output !== "object") continue;

      const content = (
        output as {
          content?: unknown;
        }
      ).content;

      if (!Array.isArray(content)) continue;

      for (const item of content) {
        if (!item || typeof item !== "object") continue;

        const text = (
          item as {
            text?: unknown;
          }
        ).text;

        if (typeof text !== "string") continue;

        const sourcesSection = text.match(/## Sources([\s\S]*)$/);

        if (!sourcesSection) continue;

        const lines = sourcesSection[1]
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        for (const line of lines) {
          const match = line.match(/^\d+\.\s*(.*?)\s*·\s*(https?:\/\/\S+)$/);

          if (!match) continue;

          sources.push({
            title: match[1].trim(),
            url: match[2].trim(),
          });
        }
      }
    }
  }

  return sources;
}
