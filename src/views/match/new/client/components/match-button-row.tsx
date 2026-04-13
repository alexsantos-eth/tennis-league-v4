import MatchDetailsRow from "./match-details-row";

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
      <MatchDetailsRow icon={icon} title={title}>
        {children}
      </MatchDetailsRow>
    </button>
  );
};

export default MatchButtonRow;