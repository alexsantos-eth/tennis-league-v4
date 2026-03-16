import { cn } from "../../lib/styles";

interface BoxContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const BoxContainer: React.FC<BoxContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(`bg-card rounded-2xl p-4`, className)} {...props}>
      {children}
    </div>
  );
};

export default BoxContainer;
