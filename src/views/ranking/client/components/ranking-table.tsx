import { CircleOff } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Text from "@/components/ui/text";
import { useAuthStore } from "@/store/auth";
import type { RankingUser } from "@/types/users";

import delays from "../tools/animations";

export interface RankingTableProps {
  users: RankingUser[];
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

const RankingTable: React.FC<RankingTableProps> = ({ users }) => {
  const { currentUser } = useAuthStore();

  if (users.length === 0) {
    return (
      <div className="py-2 flex flex-row items-center space-x-2 justify-center">
        <CircleOff className="size-4" />

        <p className="text-gray-500 text-md text-center font-semibold">
          No hay jugadores en esta categoría
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border overflow-hidden">
      <div className="grid grid-cols-[48px_1fr_72px] bg-muted/40 px-2 py-2">
        <Text variant="bodySmall" className="font-semibold text-muted-foreground">
          #
        </Text>
        <Text variant="bodySmall" className="font-semibold text-muted-foreground uppercase">
          Jugador
        </Text>
        <Text variant="bodySmall" className="font-semibold text-muted-foreground text-right">
          GTR
        </Text>
      </div>

      <div className="divide-y">
        {users
          .sort((a, b) => (Number(b.utr) || 0) - (Number(a.utr) || 0))
          .map((player, index) => {
            const isCurrentUser = (player.uid || player.id) === (currentUser?.uid || null);

            return (
              <div
                key={player.uid || player.id?.toString()}
                className={`grid grid-cols-[48px_1fr_72px] items-center px-2 py-2 whitespace-nowrap animate-fade-left ${
                  delays[index] || ""
                } ${isCurrentUser ? "bg-green-50" : "bg-background"}`}
              >
                <Text variant="body" className="font-medium">
                  {index + 1}
                </Text>

                <div className="flex items-center gap-4 min-w-0">
                  <Avatar size="sm">
                    <AvatarImage src={player.picture || ""} alt={player.name} />
                    <AvatarFallback>{getInitials(player.name || "Jugador")}</AvatarFallback>
                  </Avatar>

                  <Text variant="body" className="truncate font-medium">
                    {player.name}
                  </Text>
                </div>

                <Text variant="body" className="text-right font-semibold">
                  {Number(player.utr || 0).toFixed(2)}
                </Text>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RankingTable;
