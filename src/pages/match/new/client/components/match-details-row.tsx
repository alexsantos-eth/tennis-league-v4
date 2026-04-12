import Text from "@/components/ui/text";

interface MatchDetailsRowProps {
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

const MatchDetailsRow: React.FC<MatchDetailsRowProps> = ({
  icon,
  title,
  children,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
          {icon}
        </div>

        <Text variant="body" className="text-foreground font-medium">
          {title}
        </Text>
      </div>

      {children}
    </div>
  );
};


export default MatchDetailsRow;