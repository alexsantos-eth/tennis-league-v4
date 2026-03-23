import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import Text from "../../components/ui/text";

export interface TopbarProps {
  title?: string;
  className?: string;
  goBack?: boolean | (() => void);
  rightButton?: React.ReactNode;
}

const Topbar = ({ title, className, goBack, rightButton }: TopbarProps) => {
  const onGoBack = () => {
    if (typeof goBack === "function") {
      goBack();
    } else {
      history.back();
    }
  }

  return (
    <header
      style={{ boxShadow: "0px 5px 5px -1px rgba(0,0,0,0.02)" }}
      className={`fixed top-0 left-0 right-0 z-10 bg-background ${className}`}
    >
      <div
        data-id="container"
        className="px-6 py-4 flex items-center justify-between gap-4"
      >
        <div className="flex flex-row items-center gap-4">
          {goBack && (
            <Button
              onClick={onGoBack}
              variant="outline"
              size="icon"
              className="bg-transparent text-foreground animate-fade-left"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <Text
            variant="bodyLarge"
            className="text-foreground font-semibold animate-fade-down"
          >
            {title || "GTL"}
          </Text>
        </div>

        {rightButton}
      </div>
    </header>
  );
};

export default Topbar;
