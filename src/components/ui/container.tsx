import { cn } from "../../lib/styles";
import Text from "./text";

interface BoxContainerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

const BoxContainer: React.FC<BoxContainerProps> = ({
  children,
  className,
  title,
  ...props
}) => {
  if (Boolean(title)) {
    return (
      <div className="flex flex-col gap-4">
        {title && <Text variant="bodyXs" className="text-muted-foreground uppercase font-semibold">{title}</Text>}

        <div
          className={cn(
            `bg-card rounded-2xl p-4 flex flex-col w-full`,
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(`bg-card rounded-2xl p-4`, className)} {...props}>
      {children}
    </div>
  );
};

export default BoxContainer;
