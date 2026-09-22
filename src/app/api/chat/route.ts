import { groq } from "@ai-sdk/groq";
import { stepCountIs, streamText } from "ai";
import { createSanityMCPClient } from "@/lib/sanity-mcp";
import { extractSources } from "@/lib/extract-sources";

let sources: { title: string; url?: string }[] = [];
export async function POST(req: Request) {
  const { question } = await req.json();

  if (!question) {
    return new Response("Question is required", {
      status: 400,
    });
  }

  const mcpClient = await createSanityMCPClient();

  try {
    const tools = await mcpClient.tools();

    console.log("Sanity MCP tools:", Object.keys(tools));

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      tools,
      stopWhen: stepCountIs(10),

      system: `
You are DevDocs Agent, a frontend documentation decision assistant.

Your job is to answer questions using the information available through
the connected Sanity Context MCP tools.

Use the Sanity tools whenever the question can be answered from the
connected documentation.

Treat Sanity content as the source of truth.
Do not invent documentation or pretend that information came from Sanity
when it did not.

Give a concise explanation and mention the relevant documentation concepts
used to reach the answer.
      `,

      prompt: question,

      onFinish: async ({ steps }) => {
        sources = extractSources(steps);

        console.log("Sources:", sources);

        await mcpClient.close();
      },
    });

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = result.textStream.getReader();

          try {
            while (true) {
              const { value, done } = await reader.read();

              if (done) break;

              controller.enqueue(encoder.encode(value));
            }

            controller.enqueue(
              encoder.encode(
                `\n\n__DEV_DOCS_SOURCES__${JSON.stringify(sources)}`,
              ),
            );

            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  } catch (error) {
    await mcpClient.close();
    console.error(error);

    return new Response("Agent failed", {
      status: 500,
    });
  }
}
