import type { CrewStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

interface StatusBadgeProps {
  status: CrewStatus;
  showText?: boolean;
}

export default function StatusBadge({ status, showText = true }: StatusBadgeProps) {
  const statusConfig = {
    Online: { color: "bg-status-online", text: "Online" },
    Offline: { color: "bg-status-offline", text: "Offline" },
    Break: { color: "bg-status-break", text: "On Break" },
  };

  const config = statusConfig[status] || statusConfig.Offline;

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-full", config.color)} aria-hidden="true" />
      {showText && <span className="text-sm font-medium">{config.text}</span>}
    </div>
  );
}
