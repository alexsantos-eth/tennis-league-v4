import InfoRow from "@/components/ui/info-row";
import { cn } from "@/lib/styles";

interface MatchButtonRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const MatchButtonRow = ({
  title,
  icon,
  children,
  className,
  ...btnProps
}: MatchButtonRowProps) => {
  return (
    <button
      type="button"
      className={cn(
        "p-4 border-b border-border/70 last:border-b-0 justify-between w-full",
        className,
      )}
      {...btnProps}
    >
      <InfoRow icon={icon} title={title}>
        {children}
      </InfoRow>
    </button>
  );
};

export default MatchButtonRow;
