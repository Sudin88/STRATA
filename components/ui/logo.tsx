import Link from "next/link";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Three stacked strata layers. Colours come from theme tokens, not literals. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden className={cn("size-[22px]", className)}>
      <path d="M3 6.5 11 2l8 4.5-8 4.5z" className="fill-ion" />
      <path
        d="M3 11.5 11 16l8-4.5"
        fill="none"
        className="stroke-fg"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 15.5 11 20l8-4.5"
        fill="none"
        className="stroke-dim"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${SITE.name} — home`}
      className={cn("flex items-center gap-2.5", className)}
    >
      <LogoMark />
      <span className="text-[15px] font-extrabold tracking-[0.14em] uppercase">
        {SITE.name}
      </span>
    </Link>
  );
}
