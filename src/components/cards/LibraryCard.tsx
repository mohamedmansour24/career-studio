import Link from "next/link";

export function LibraryCard({
  title,
  description,
  href,
  accentColor = "#5B85AA",
  ctaLabel = "Explore",
}: {
  title: string;
  description: string;
  href: string;
  accentColor?: string;
  ctaLabel?: string;
}) {
  return (
    <div
      className="
        relative rounded-2xl
        bg-gradient-to-b from-[#0A2545] to-[#071B33]
        p-5
        overflow-hidden
      "
      style={{
        border: `1px solid ${accentColor}99`,
        boxShadow: `0 0 0 1px ${accentColor}40, 0 30px 80px rgba(0,0,0,0.60)`,
      }}
    >
      {/* Title */}
      <h3 className="text-center text-[24px] font-semibold leading-snug">
        {title}
      </h3>
      
      {/* Description */}
      <p className="mt-6 text-[14px] font-normal text-white/70 leading-relaxed line-clamp-4 text-center">
        {description}
      </p>
      
      {/* Button */}
      <div className="mt-8">
        <Link
          href={href}
          className="
            flex items-center justify-center
            w-full
            px-5 py-2.5
            rounded-lg
            border
            text-[16px] 
            hover:bg-white/10 transition
          "
          style={{ borderColor: "#5B85AA" }}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}