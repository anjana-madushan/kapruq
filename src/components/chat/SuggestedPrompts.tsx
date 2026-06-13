'use client';

const SUGGESTIONS = [
  "I forgot my wife's birthday 😅",
  "I just moved into a new place",
  "I need a gift under LKR 2,000",
  "What can be delivered today?",
  "Help me plan a grocery run",
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
