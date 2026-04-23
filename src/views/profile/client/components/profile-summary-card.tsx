import { BadgeCheck } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

import type { User } from "@/types/users";

interface ProfileSummaryCardProps {
  user: User | null;
  fullName: string;
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
}) => {
  return (
    <BoxContainer className="p-4 gap-6 flex flex-col">
      <div className="flex items-center justify-center gap-4">
        <div className="relative">
          <Avatar size="lg" className="size-26">
            <AvatarImage src={user?.picture || ""} alt={fullName} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>

          <AvatarBadge className="size-3 absolute bottom-0 right-0" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Text variant="h3" className="text-foreground">
              {fullName}
            </Text>

            <BadgeCheck className="size-4 text-primary" />
          </div>

          <Text variant="body" className="text-muted-foreground text-left">
            {user?.category
              ? `Categoria ${user.category}`
              : "Jugador de la liga"}
          </Text>
        </div>
      </div>
    </BoxContainer>
  );
};

export default ProfileSummaryCard;
