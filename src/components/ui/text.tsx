import { cn } from "../../lib/styles";

interface TextProps {
  children: React.ReactNode;
  variant: "h1" | "h2" | "h3" | "h4" | "body" | "bodyLarge" | "bodySmall";
  className?: string;
}

const Text: React.FC<TextProps> = ({ children, variant, className }) => {
  switch (variant) {
    case "h1":
      return <h1 className={cn("text-5xl text-primary-foreground font-semibold", className)}>{children}</h1>;
    case "h2":
      return <h2 className={cn("text-3xl text-primary-foreground font-semibold", className)}>{children}</h2>;
    case "h3":
      return <h3 className={cn("text-2xl text-primary-foreground font-semibold", className)}>{children}</h3>;
    case "h4":
      return <h4 className={cn("text-xl text-primary-foreground font-semibold", className)}>{children}</h4>;
    case "body":
      return <p className={cn("text-base text-primary-foreground", className)}>{children}</p>;
    case "bodyLarge":
      return <p className={cn("text-lg text-primary-foreground", className)}>{children}</p>;
    case "bodySmall":
      return <p className={cn("text-sm text-primary-foreground", className)}>{children}</p>;
    default:
      return <div>{children}</div>;
  }
};

export default Text;
