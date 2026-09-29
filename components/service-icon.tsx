"use client";

import {
  Search,
  MonitorSmartphone,
  Clapperboard,
  MessageSquareText,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/lib/data";

/** Maps serializable service keys to their icon components. */
const ICONS: Record<ServiceIconKey, LucideIcon> = {
  seo: Search,
  web: MonitorSmartphone,
  video: Clapperboard,
  social: MessageSquareText,
  ads: Target,
  automation: Workflow,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconKey;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
