import InfoRow from "@/components/ui/info-row";

interface MatchButtonRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const MatchButtonRow = ({
  title,
  icon,
  children,
  ...btnProps
}: MatchButtonRowProps) => {
  return (
    <button
      type="button"
      className="p-4 border-b border-border/70 last:border-b-0 justify-between w-full"
      {...btnProps}
    >
      <InfoRow icon={icon} title={title}>
        {children}
      </InfoRow>
    </button>
  );
};

export default MatchButtonRow;