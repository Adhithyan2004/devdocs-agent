import { createMCPClient } from "@ai-sdk/mcp";

export async function createSanityMCPClient() {
  const url = process.env.SANITY_CONTEXT_MCP_URL;
  const token = process.env.SANITY_ORGANIZATION_TOKEN;

  if (!url) {
    throw new Error("SANITY_CONTEXT_MCP_URL is missing");
  }

  if (!token) {
    throw new Error("SANITY_ORGANIZATION_TOKEN is missing");
  }

  return createMCPClient({
    transport: {
      type: "http",
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
