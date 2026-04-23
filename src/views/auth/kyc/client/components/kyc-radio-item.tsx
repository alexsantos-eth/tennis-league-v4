import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RadioItemProps {
  isActive?: boolean;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

const RadioItem: React.FC<RadioItemProps> = ({
  isActive,
  label,
  icon,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-5 text-center transition-all duration-200",
        isActive
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:bg-muted/60",
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};

export default RadioItem;
