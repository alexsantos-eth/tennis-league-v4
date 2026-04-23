import { ArrowLeft, Share2Icon } from "lucide-react";

import { shareLink } from "@/lib/share";

import { Button } from "../../components/ui/button";
import Text from "../../components/ui/text";
import { cn } from "@/lib/styles";

export interface TopbarProps {
  title?: string;
  className?: string;
  goBack?: boolean | (() => void);
  rightButton?: React.ReactNode;
  shareButton?: boolean;
}

const Topbar = ({
  title,
  className,
  goBack,
  rightButton,
  shareButton = false,
}: TopbarProps) => {
  const onGoBack = () => {
    if (typeof goBack === "function") {
      goBack();
    } else {
      history.back();
    }
  };

  return (
    <header
      style={{ boxShadow: "0px 5px 5px -1px rgba(0,0,0,0.02)" }}
      className={cn( "fixed top-0 left-0 right-0 z-10 bg-background", className)}
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
            {title}
          </Text>
        </div>

        {rightButton}
        {shareButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              shareLink(window.location.href);
            }}
            className="bg-transparent text-foreground animate-fade-right"
          >
            <Share2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
