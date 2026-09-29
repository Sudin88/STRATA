"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { updateLeadStatus } from "@/app/dashboard/actions";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  won: "Won",
  lost: "Lost",
};

/* Single-accent palette: the accent marks a fresh lead, a solid fill marks a
   closed win, neutrals carry the rest. */
const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-ion-soft text-ion",
  contacted: "bg-raise text-mut",
  won: "bg-fg text-ink",
  lost: "bg-surface text-dim",
};

/*
 * Per-lead pipeline control. Optimistically shows the chosen status, calls the
 * updateLeadStatus Server Action inside a transition, then refreshes so the
 * server (RLS-gated) truth wins. Reverts the label if the write fails.
 */
export function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<LeadStatus>(status);
  const [pending, startTransition] = useTransition();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as LeadStatus;
    const previous = value;
    setValue(next);
    startTransition(async () => {
      try {
        await updateLeadStatus(id, next);
        router.refresh();
      } catch {
        setValue(previous);
      }
    });
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={onChange}
        // This control is rendered inside a <summary>; keep a click on it from
        // bubbling up and toggling the row's <details>.
        onClick={(e) => e.stopPropagation()}
        disabled={pending}
        aria-label="Lead status"
        className={cn(
          "cursor-pointer appearance-none rounded-pill border border-line py-1 pr-7 pl-3 text-xs font-medium transition-colors focus:border-ion/60 focus:outline-none disabled:opacity-60",
          STATUS_STYLE[value],
        )}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2 size-3.5 opacity-70"
      />
    </div>
  );
}
