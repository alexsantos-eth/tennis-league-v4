import { Button } from "@/components/ui/button";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, ...props }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t border-border z-10">
      <Button
        className="w-full text-lg h-12 rounded-2xl"
        type="button"
        size="lg"
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default ActionButton;
