import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl sm:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-heading text-balance">{title}</h2>
      {subtitle && <p className="mt-5 text-base leading-relaxed text-mut sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
