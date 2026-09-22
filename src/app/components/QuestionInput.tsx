"use client";

import { SubmitEvent, useState } from "react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export default function QuestionInput({
  onSubmit,
  disabled = false,
}: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || disabled) {
      return;
    }

    onSubmit(trimmedQuestion);
    setQuestion("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="
          group flex items-center gap-2 rounded-2xl
          border border-white/10
          bg-white/[0.04]
          p-2
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
          transition-all duration-300
          focus-within:border-cyan-400/40
          focus-within:bg-white/[0.06]
          focus-within:shadow-[0_0_40px_rgba(34,211,238,0.08)]
        "
      >
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a frontend development question..."
          disabled={disabled}
          className="
            min-w-0 flex-1
            bg-transparent
            px-4 py-3
            text-sm text-white
            placeholder:text-slate-600
            outline-none
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className="
            shrink-0
            rounded-xl
            bg-cyan-400
            px-5 py-3
            text-sm font-semibold
            text-slate-950
            shadow-[0_0_20px_rgba(34,211,238,0.15)]
            transition-all duration-200
            hover:bg-cyan-300
            hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]
            active:scale-[0.97]
            disabled:cursor-not-allowed
            disabled:bg-slate-800
            disabled:text-slate-600
            disabled:shadow-none
          "
        >
          Ask
        </button>
      </div>
    </form>
  );
}
