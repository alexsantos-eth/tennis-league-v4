import { Button } from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { BellIcon } from "lucide-react";

import { useAuthStore } from "../../../store/auth";

const HomeHeader: React.FC = () => {
  const { currentUser: user } = useAuthStore();

  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <div className="bg-accent fixed top-0 left-0 w-full z-10">
      <div className="bg-primary p-6 rounded-b-3xl drop-shadow-lg w-full">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-4">
            <img
              className="w-12.5 h-12.5 min-w-12.5 animate-fade-right"
              src="/images/logo.webp"
              alt="GTL Logo"
              loading="eager"
              width={50}
              height={50}
            />

            <div>
              <Text variant="body" className="animate-fade-down text-primary-foreground">
                Bienvenido de nuevo!
              </Text>

              {name.length > 0 && (
                <Text variant="h3" className="animate-fade-down text-primary-foreground">
                  {name}
                </Text>
              )}
            </div>
          </div>

          <div className="animate-fade-left">
            <Button
              size="icon-lg"
              variant="outline"
              className="bg-white/10 text-primary-foreground"
            >
              <BellIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
