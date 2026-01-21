import Link from "next/link";
import { Briefcase, GraduationCap, Building2 } from "lucide-react";

type JourneyCardProps = {
  count: string;
  label: string;
  description: string;
  buttonLabel: string;
  href: string;
};

const iconMap: Record<string, React.ReactNode> = {
  CAREERS: <Briefcase className="h-6 w-6" />,
  MAJORS: <GraduationCap className="h-6 w-6" />,
  COLLEGES: <Building2 className="h-6 w-6" />,
  الوظائف: <Briefcase className="h-6 w-6" />,
  التخصصات: <GraduationCap className="h-6 w-6" />,
  الجامعات: <Building2 className="h-6 w-6" />,
};

export function JourneyCard({
  count,
  label,
  description,
  buttonLabel,
  href,
}: JourneyCardProps) {
  const icon = iconMap[label] || <Briefcase className="h-6 w-6" />;
  const isComingSoon = buttonLabel.toLowerCase().includes("coming") || buttonLabel.includes("قريباً");

  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon + Count */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="text-2xl font-semibold tracking-tight">{count}</div>
      </div>

      {/* Label */}
      <div className="mt-1 text-lg font-semibold tracking-wide text-secondary uppercase">
        {label}
      </div>

      {/* Description */}
      <p className="mt-4 max-w-[270px] text-foreground/65 text-sm leading-relaxed min-h-[96px]">
        {description}
      </p>

      {/* Button */}
      <div className="mt-6">
        {isComingSoon ? (
          <span className="inline-flex items-center justify-center rounded-lg border border-border bg-muted/50 px-8 py-3 text-xs font-semibold tracking-wide text-foreground/50">
            {buttonLabel}
          </span>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition px-8 py-3 text-xs font-semibold tracking-wide"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
