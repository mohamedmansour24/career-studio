import { FloatingRobot } from "@/components/site/FloatingRobot";
export function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen text-white overflow-hidden"
      style={{
        backgroundColor: "#001F3F",
        backgroundImage: `
          radial-gradient(ellipse at top, rgba(255,255,255,0.10), transparent 30%),
          radial-gradient(circle at 80% 30%, rgba(0,180,255,0.14), transparent 55%),
          radial-gradient(circle at 20% 90%, rgba(255,140,0,0.10), transparent 55%)
        `,
      }}
    >
      {children}
      <FloatingRobot />
    </div>
  );
}
