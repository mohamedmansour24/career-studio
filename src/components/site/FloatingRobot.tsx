import Image from "next/image";

export function FloatingRobot() {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-end gap-3">
      <button
        className="
          hidden sm:flex items-center
          px-4 py-3 rounded-2xl
          bg-orange-500 hover:bg-orange-600 transition
          text-sm font-medium
          relative
        "
      >
        Ask me anything
        <span
          className="
            absolute -right-2 bottom-3
            h-3 w-3 rotate-45
            bg-orange-500
          "
        />
      </button>

      <button
        className="
          h-20 w-20 rounded-2xl
          bg-white/10 border border-white/15
          flex items-center justify-center
          hover:bg-white/15 transition
        "
        aria-label="Ask me anything"
      >
        <Image
          src="/assets/robot.png"
          alt="Ask me anything"
          width={64}
          height={64}
          priority
        />
      </button>
    </div>
  );
}
