import { cn } from "@/lib/styles";

interface StackProps {
  className?: string;
  children?: React.ReactNode;
  noPx?: boolean;
  size?: "sm" | "default";
  orientation?: "vertical" | "horizontal";
}

const Stack: React.FC<StackProps> = ({
  className,
  children,
  size = "default",
  orientation = "vertical",
  noPx = false,
}) => {
  return (
    <div
      className={cn(
        "flex",
        size === "default" ? "gap-6" : "gap-4",
        orientation === "vertical" ? "flex-col" : "flex-row",
        !noPx && (size === "default" ? "px-6" : "px-4"),
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Stack;
