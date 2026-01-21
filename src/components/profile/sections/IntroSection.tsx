export function IntroSection({ text }: { text: string }) {
  return (
    <div
      className="
        max-h-[300px] overflow-y-auto pr-2
        text-white/70 leading-relaxed whitespace-pre-line
        scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-white/30
      "
    >
      {text}
    </div>
  );
}
