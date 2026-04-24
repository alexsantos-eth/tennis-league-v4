import { Children } from "react";

import { cn } from "@/lib/styles";

interface StackProps {
  className?: string;
  children?: React.ReactNode;
  noPx?: boolean;
  size?: "sm" | "default";
  orientation?: "vertical" | "horizontal";
  innerRef?: React.Ref<HTMLDivElement | null>;
}

const Stack: React.FC<StackProps> = ({
  className,
  children,
  size = "default",
  orientation = "vertical",
  noPx = false,
  innerRef,
}) => {
  const normalizedChildren = Children.toArray(children).filter(
    (child) => child !== null && child !== undefined && child !== false,
  );

  return (
    <div
      ref={innerRef}
      className={cn(
        "flex",
        size === "default" ? "gap-6" : "gap-4",
        orientation === "vertical" ? "flex-col" : "flex-row",
        !noPx && (size === "default" ? "px-6" : "px-4"),
        className,
      )}
    >
      {normalizedChildren}
    </div>
  );
};

export default Stack;
