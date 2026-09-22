"use client";

import { useState } from "react";
import QuestionInput from "./QuestionInput";
import Answer from "./Answer";
import Sources from "./Sources";

export default function Chat() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<{ title: string; url?: string }[]>([]);

  async function handleQuestion(question: string) {
    setAnswer("");
    setSources([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get an answer");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        fullResponse += decoder.decode(value, { stream: true });

        const markerIndex = fullResponse.indexOf("__DEV_DOCS_SOURCES__");

        if (markerIndex !== -1) {
          const answerPart = fullResponse.slice(0, markerIndex);

          const sourcesPart = fullResponse.slice(
            markerIndex + "__DEV_DOCS_SOURCES__".length,
          );

          setAnswer(answerPart.trim());

          try {
            const parsedSources = JSON.parse(sourcesPart);

            setSources(parsedSources);
          } catch {
            // Sources may not be completely received yet.
          }
        } else {
          setAnswer(fullResponse);
        }
      }
    } catch (error) {
      console.error(error);

      setAnswer(
        "Something went wrong while getting the answer. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <QuestionInput onSubmit={handleQuestion} disabled={isLoading} />

      <Answer answer={answer} isLoading={isLoading} />

      <Sources sources={sources} />
    </div>
  );
}
