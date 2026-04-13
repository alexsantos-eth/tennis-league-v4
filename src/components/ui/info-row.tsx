import Text from "@/components/ui/text";
import { cn } from "@/lib/styles";

interface InfoRowProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
          {icon}
        </div>

        <div className="flex flex-col">
          {typeof title === "string" ? (
            <Text
              variant="body"
              className="flex-1 text-left font-medium text-foreground"
            >
              {title}
            </Text>
          ) : (
            title
          )}

          {typeof description === "string" ? (
            <Text
              variant="bodySmall"
              className="flex-1 text-left text-muted-foreground"
            >
              {description}
            </Text>
          ) : (
            description
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

export default InfoRow;
