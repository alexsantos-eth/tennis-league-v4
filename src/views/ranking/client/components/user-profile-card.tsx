"use client";

import { BadgeCheck, Flame } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";
import type { User } from "@/types/users";

interface UserProfileCardProps {
  user: User | null;
  userCategoryRank: string;
  overallRank: string;
}

const getDisplayName = (user: User | null) => {
  const byNames = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  if (byNames.length > 0) {
    return byNames;
  }

  if ((user?.name || "").trim().length > 0) {
    return String(user?.name || "");
  }

  return "Jugador";
};

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

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  userCategoryRank = "0",
  overallRank = "0",
}) => {
  const fullName = getDisplayName(user);

  return (
    <BoxContainer className="shadow-sm p-5 gap-5 flex flex-col">
      <div className="p-0 flex flex-col space-y-5 w-full items-center">
        <div className="flex flex-row items-center space-x-4">
          <div className="p-1 bg-input rounded-full">
            <Avatar size="lg" className="size-20">
              <AvatarImage src={user?.picture || ""} alt={fullName} />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col animate-fade-down">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-2">
                  <Text variant="h3" className="text-primary">
                    {fullName}
                  </Text>

                  <BadgeCheck className="size-4 text-green-600" />
                </div>

                <Text variant="body" className="text-muted-foreground">
                  {`Categoría ${user?.category}`}
                </Text>
              </div>

              <div className="flex flex-row items-center space-x-2">
                <Text variant="body" className="text-muted-foreground">GTR</Text>

                <div className="flex flex-row items-center">
                  <Flame className="size-5 text-green-500" />
                  <Text variant="h3" className="text-green-500">
                    {Number(user?.utr ?? 0).toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full" />

        <div className="flex flex-row items-center justify-center w-full space-x-7">
          <div className="animate-fade-down animate-delay-100">
            <Text variant="bodySmall" className="text-muted-foreground">Posición en categoría</Text>
            <Text variant="h3" className="text-center text-foreground">
              #{userCategoryRank}
            </Text>
          </div>

          <div className="animate-fade-down animate-delay-200">
            <Text variant="bodySmall" className="text-muted-foreground">Posición general</Text>
            <Text variant="h3" className="text-center text-foreground">#{overallRank}</Text>
          </div>
        </div>
      </div>
    </BoxContainer>
  );
};

export default UserProfileCard;
