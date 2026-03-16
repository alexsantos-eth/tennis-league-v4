
import React from "react";
import { cn } from "../../lib/styles";
import Text from "../../components/ui/text";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  className?: string;
  justIcon?: boolean;
}
const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive = false,
  justIcon = false,
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        "flex flex-col space-y-1 items-center h-13.75 w-13.75 justify-center",
        isActive ? "text-primary" : "text-foreground",
        className,
      )}
    >
      {icon}
      {!justIcon && <Text variant="body" className="text-foreground font-normal">{label}</Text>}
    </a>
  );
};

export default NavItem;
