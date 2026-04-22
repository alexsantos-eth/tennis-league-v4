import { LogOut } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

import type { User } from "@/types/users";

interface ProfileSummaryCardProps {
  user: User | null;
  fullName: string;
  stats: {
    label: string;
    value: string;
  }[];
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const getInitials = (name: string) => {
  const chunks = name.trim().split(/\s+/).filter(Boolean);

  if (chunks.length === 0) {
    return "JG";
  }

  return chunks
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("");
};

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  user,
  fullName,
  stats,
  onLogout,
  isLoggingOut = false,
}) => {
  return (
    <BoxContainer className="shadow-sm p-4 gap-6 flex flex-col">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative">
          <Avatar size="lg" className="size-26">
            <AvatarImage src={user?.picture || ""} alt={fullName} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>

          <AvatarBadge className="size-3 absolute bottom-0 right-0" />
        </div>

        <div className="flex flex-col gap-1">
          <Text variant="h3" className="text-foreground">
            {fullName}
          </Text>
          <Text variant="body" className="text-muted-foreground">
            {user?.category
              ? `Categoria ${user.category}`
              : "Jugador de la liga"}
          </Text>
        </div>

        <Button
          type="button"
          size="lg"
          className="min-w-44"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut />
          {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          return (
            <BoxContainer
              key={stat.label}
              className="border px-0 py-2 rounded-xl"
            >
              <Text
                variant="bodySmall"
                className="text-muted-foreground font-semibold text-center"
              >
                {stat.label}
              </Text>

              <Text variant="h4" className="text-primary text-center">
                {stat.value}
              </Text>
            </BoxContainer>
          );
        })}
      </div>
    </BoxContainer>
  );
};

export default ProfileSummaryCard;
