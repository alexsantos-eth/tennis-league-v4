import { cn } from "../../lib/styles";

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyLarge"
    | "bodySmall"
    | "bodyXs";
  className?: string;
}

const Text: React.FC<TextProps> = ({ children, variant, className }) => {
  switch (variant) {
    case "h1":
      return (
        <h1
          className={cn(
            "text-5xl text-foreground font-semibold",
            className,
          )}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={cn(
            "text-3xl text-foreground font-semibold",
            className,
          )}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={cn(
            "text-2xl text-foreground font-semibold",
            className,
          )}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={cn(
            "text-xl text-foreground font-semibold",
            className,
          )}
        >
          {children}
        </h4>
      );
    case "body":
      return (
        <p className={cn("text-base text-foreground", className)}>
          {children}
        </p>
      );
    case "bodyLarge":
      return (
        <p className={cn("text-lg text-foreground", className)}>
          {children}
        </p>
      );
    case "bodySmall":
      return (
        <p className={cn("text-sm text-foreground", className)}>
          {children}
        </p>
      );
    case "bodyXs":
      return (
        <p className={cn("text-xs text-foreground", className)}>
          {children}
        </p>
      );
    default:
      return <div>{children}</div>;
  }
};

export default Text;
