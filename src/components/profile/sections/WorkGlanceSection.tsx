const LEVELS = ["low", "medium", "high"] as const;
const FILLED_COUNT: Record<(typeof LEVELS)[number], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function WorkGlanceSection({
  rows,
}: {
  rows: Array<{ label: string; level: (typeof LEVELS)[number] }>;
}) {
  return (
    <div className="space-y-5">
      {rows.map((r) => {
        const filled = FILLED_COUNT[r.level] ?? 1;
        return (
          <div key={r.label}>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">{r.label}</div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => {
                const isOn = i < filled;
                return (
                  <div
                    key={i}
                    className={`h-3 rounded-full border border-border ${
                      isOn ? "bg-secondary shadow-[0_0_10px_var(--secondary)]" : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}