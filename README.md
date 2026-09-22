# DevDocs Agent

An AI-powered frontend documentation agent that answers development questions using real documentation retrieved through **Sanity Context MCP**.

Instead of relying only on the model's pretrained knowledge, DevDocs Agent can query a curated documentation Knowledge Base and use the retrieved content as context before generating an answer.

🌐 **Live Demo:** https://devdocs-agent.vercel.app/

⚠️ **Note:** This agent uses Groq's free tier, so responses may occasionally be slow or fail due to rate limits. If that happens, please try again after a short while.

---

## What It Does

DevDocs Agent is a small AI agent designed to answer practical frontend development questions using a curated documentation source.

You can ask questions such as:

- When should I use `useEffect` vs `useLayoutEffect`?
- What does a particular React API do?
- Should this logic run on the server or the client?
- How does a browser API work?
- What approach should I use for a particular frontend problem?

The agent retrieves relevant documentation from Sanity and uses that information to construct its response.

The final answer is rendered as Markdown, and the documentation sources used by the agent are displayed below the answer.

The goal is simple:

> Ask a frontend development question and get an answer grounded in actual documentation rather than relying only on the model's internal knowledge.

---

## Demo

🚀 **Live Application:** https://devdocs-agent.vercel.app/

The application provides a minimal interface:

1. Ask a frontend development question.
2. The agent decides whether it needs information from the connected documentation.
3. Sanity Context MCP retrieves relevant content.
4. Gemini uses the retrieved content to generate the answer.
5. The answer is streamed to the browser.
6. The documentation sources are displayed alongside the response.

---

## How It Works

The application uses an agentic tool-calling workflow.

Instead of sending a question directly to Gemini and accepting whatever it knows, the model has access to a Sanity Context MCP endpoint.

A simplified version of the architecture looks like this:

```text
                         User
                          │
                          │ Question
                          ▼
                  ┌─────────────────┐
                  │   Groq Agent    │
                  └────────┬────────┘
                           │
                           │ MCP tool call
                           ▼
                  ┌─────────────────┐
                  │ Sanity Context  │
                  │      MCP        │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Sanity Knowledge│
                  │      Base       │
                  └────────┬────────┘
                           │
                           │ Relevant documentation
                           ▼
                  ┌─────────────────┐
                  │   Groq Agent    │
                  │                 │
                  │ Reason + Answer │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Next.js Server  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Frontend     │
                  │                 │
                  │ Answer + Sources│
                  └─────────────────┘
```

The important part is that the model is not directly connected to the browser or to the Sanity credentials.

The interaction happens on the server.

### Why Sanity Context MCP?

Large language models already contain a large amount of knowledge about popular frameworks, APIs, and web technologies.

However, relying entirely on pretrained knowledge creates some practical problems:

- Documentation changes over time.
- APIs evolve.
- Framework behavior can change between versions.
- A model can produce an answer that sounds convincing but does not match the documentation you want your application to follow.
- There is no guarantee that the model's internal knowledge represents the exact documentation source you care about.

This is where Sanity Context MCP becomes useful.

Instead of building the application around:

```text
User
  ↓
LLM
  ↓
Answer
```

the project uses:

```text
User
  ↓
LLM Agent
  ↓
Sanity Context MCP
  ↓
Knowledge Base
  ↓
Relevant Documentation
  ↓
LLM
  ↓
Grounded Answer
```

Sanity provides the knowledge layer while Groq (openai-model) provides the reasoning and generation.

### Does Sanity Make Groq(openai-model) Smarter?

Not by retraining the model.

Groq(openai-model) is still the same underlying model.

Sanity provides additional, application-controlled context at inference time.

That means the model can access information that has been deliberately selected and structured for the application instead of depending entirely on what it learned during training.

This is useful when you want the model to answer according to a specific documentation source.

The distinction is:

```text
Model knowledge
      +
Retrieved application context
      =
Generated answer
```

The project is therefore less about making the model itself more capable and more about giving the model access to the right knowledge at the right time.

---

## How I Used Sanity

I created a Sanity Knowledge Base containing curated frontend documentation.

The documentation focus is:

- React
- Next.js

The documentation is connected to Sanity Context, which exposes the Knowledge Base through an MCP endpoint.

The Next.js server creates an MCP client and exposes the available Sanity tools to Groq(openai-model).

The relevant flow is:

```text
Next.js API Route
       │
       ▼
createSanityMCPClient()
       │
       ▼
Sanity Context MCP Endpoint
       │
       ▼
MCP Tools
       │
       ▼
Groq(openai-model) Agent
```

The agent is instructed to use the connected Sanity documentation whenever the question can be answered from the available content.

The system prompt also tells the agent to treat the Sanity content as the source of truth and not invent documentation.

### MCP Tools

The Sanity Context MCP endpoint currently exposes tools including:

- `initial_context`
- `knowledge_base_read`

The agent can decide when to use these tools during generation.

For example, when asking about React effect hooks, the agent can retrieve the relevant documentation from the Knowledge Base before producing its final answer.

This gives the model a tool-based way of accessing external knowledge rather than requiring the application to manually fetch and inject every document into every prompt.

### The Agent's Workflow

Suppose the user asks:

> What is `useEffect` and when should I use it?

The request reaches the server.

The server creates the Sanity MCP client and obtains the available tools.

Groq(openai-model) receives the question together with those tools.

The agent can then call the Sanity tools to retrieve relevant documentation.

The retrieved content contains the actual documentation information as well as source information.

Groq(openai-model) uses the retrieved content to construct the final response.

The resulting answer is streamed back to the browser.

The application also extracts the documentation sources from the MCP tool results and displays them underneath the answer.

The result is:

```text
Question
   ↓
Agent reasoning
   ↓
Sanity MCP tool call
   ↓
Relevant documentation
   ↓
Agent reasoning
   ↓
Markdown answer
   ↓
Sources
```

### Source Attribution

One of the useful parts of the MCP response is that the retrieved documentation contains source information.

The application extracts the source title and URL from the tool results.

For example:

```json
[
  {
    "title": "useLayoutEffect – React — Web",
    "url": "https://react.dev/reference/react/useLayoutEffect"
  },
  {
    "title": "useInsertionEffect – React — Web",
    "url": "https://react.dev/reference/react/useInsertionEffect"
  },
  {
    "title": "useSyncExternalStore – React — Web",
    "url": "https://react.dev/reference/react/useSyncExternalStore"
  },
  {
    "title": "useEffectEvent – React — Web",
    "url": "https://react.dev/reference/react/useEffectEvent"
  }
]
```

These are then displayed in the UI.

This makes the response more inspectable:

```text
Answer
────────────────────────────

useEffect is used to synchronize
a component with an external system...

Sources
────────────────────────────

• useLayoutEffect – React — Web
• useInsertionEffect – React — Web
• useSyncExternalStore – React — Web
• useEffectEvent – React — Web
```

The model is still generating the answer, but the user can see the documentation sources that informed the response.

### Markdown Rendering

Groq(openai-model) returns Markdown.

Instead of displaying the raw Markdown directly, the frontend uses `react-markdown` to render it into a readable documentation-style interface.

For example, the model can return:

````markdown
### Syntax

```javascript
useEffect(setup, dependencies?)
```

- `setup`: Your effect logic.
- `dependencies`: Reactive values used by the effect.
````

The frontend renders this as actual headings, lists, inline code, and code blocks.

This keeps the agent implementation simple while still producing a readable UI.

---

## Streaming Responses

The answer is streamed from the server rather than waiting for the entire generation to finish.

The flow is:

```text
Groq(openai-model) generates token/chunk
        ↓
Next.js server
        ↓
HTTP stream
        ↓
Chat.tsx
        ↓
Answer component
```

This means the user can start reading the answer while the model is still generating it.

After the answer finishes, the application also sends the extracted source metadata through the same response stream.

The frontend separates the answer from the source metadata and passes the sources to the `Sources` component.

---

## Tech Stack

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Markdown

**AI**

- Groq(openai-model)
- Vercel AI SDK

**Knowledge Layer**

- Sanity
- Sanity Context
- Model Context Protocol (MCP)

**Deployment**

- Vercel

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   ├── components/
│   │   ├── Answer.tsx
│   │   ├── Chat.tsx
│   │   ├── QuestionInput.tsx
│   │   └── Sources.tsx
│   │
│   ├── page.tsx
│   └── layout.tsx
│
└── lib/
    ├── extract-sources.ts
    └── sanity-mcp.ts
```

- **`sanity-mcp.ts`** — Creates the server-side connection to the Sanity Context MCP endpoint.
- **`route.ts`** — Runs the Groq(openai-model) agent and exposes the Sanity MCP tools to the model.
- **`extract-sources.ts`** — Extracts source titles and URLs from the Sanity MCP tool results.
- **`Chat.tsx`** — Handles the user question, communicates with the API, processes the streamed response, and passes the extracted sources to the UI.
- **`Answer.tsx`** — Renders the agent response using `react-markdown`.
- **`Sources.tsx`** — Displays the documentation sources returned by the Sanity Knowledge Base.

---

## Environment Variables

Create a `.env.local` file containing:

```bash
SANITY_CONTEXT_MCP_URL=your_sanity_context_mcp_endpoint
SANITY_ORGANIZATION_TOKEN=your_sanity_organization_token
GROQ_API_KEY=your_groq_model_api_key
```

These credentials are intentionally kept on the server.

The Sanity organization token is used by the server-side MCP client and is never exposed to the browser.

Do not commit `.env.local` to the repository.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Adhithyan2004/devdocs-agent
cd devdocs-agent
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and add the required environment variables.

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Why This Architecture?

The main idea behind this project is separating reasoning from knowledge.

**Groq(openai-model) handles:**

- Reasoning
- Tool selection
- Answer generation
- Natural language explanation

**Sanity handles:**

- Structured documentation
- Curated knowledge
- Content management
- Documentation context

**MCP** handles the connection between the agent and the knowledge layer.

This separation means the documentation can evolve independently from the model.

If the documentation changes, the Knowledge Base can be updated without retraining Gemini.

The architecture therefore looks like:

```text
┌────────────────────┐
│Groq(openai-model)  │
│                    │
│ Reasoning + Agent  │
└─────────┬──────────┘
          │
          │ MCP
          ▼
┌────────────────────┐
│       Sanity       │
│                    │
│ Knowledge + Content│
└────────────────────┘
```

---

## What I Learned

The biggest takeaway from this project was that an AI application does not necessarily need to make the model itself bigger or more complex.

A relatively small model can become much more useful for a specific task when it has access to the right external context.

The interesting engineering problem becomes:

> How do I give the model the right information at the right time in a controlled way?

Sanity Context MCP provides one way of solving that problem.

It also changes the role of the application from simply being:

```text
Chat UI + LLM
```

to:

```text
UI
+
Agent
+
Tools
+
Knowledge
+
Grounding
```

That was the main reason I wanted to build this project.

---

## Limitations

This is intentionally a small MVP.

It currently does not include:

- User authentication
- Conversation history
- Persistent chat sessions
- User-uploaded documentation
- A custom vector database
- Fine-tuning
- Multiple agents
- Exhaustive coverage of every frontend framework
- Advanced evaluation or automated groundedness scoring

The goal was not to build a complete documentation platform.

The goal was to build a small but real agent that can query real external content and use that content during generation.

---

## Future Improvements

Some things I'd like to explore next:

- Expand the curated Knowledge Base
- Add more frontend ecosystems
- Improve source extraction and citation handling
- Let users inspect the retrieved documentation
- Add conversation history
- Add automated evaluation questions
- Compare answers with and without retrieved context
- Measure retrieval quality and groundedness
- Add richer MCP tool usage
- Add more sophisticated retrieval and ranking

---

## Live Demo

🚀 https://devdocs-agent.vercel.app/

Try asking:

> What is `useEffect` and when should I use it?

or:

> What is the difference between `useEffect` and `useLayoutEffect`?

---

## Built for the Sanity Challenge

This project was built for the **DEV X Sanity Challenge**.

The challenge gave me an opportunity to explore what happens when an AI agent is connected to a real, curated knowledge source instead of relying entirely on its pretrained knowledge.

The final architecture is intentionally small:

```text
User
 ↓
Next.js
 ↓
Groq(openai-model) Agent
 ↓
Sanity Context MCP
 ↓
Sanity Knowledge Base
 ↓
Gemini
 ↓
Markdown Answer + Sources
```

🌐 **Live:** https://devdocs-agent.vercel.app/
