import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";
import { ROUTES } from "@/lib/routes";
import { useMatchDetailPlayersStore } from "@/store/match-detail-players";

import type { MatchCreatorSummary } from "@/types/match";

interface MatchPlayersCardProps {
  players: MatchCreatorSummary[];
  playersCapacity: number;
  currentUserUid?: string;
  matchId?: string;
}

const getPlayerName = (player?: MatchCreatorSummary) => {
  if (!player) {
    return "Libre";
  }

  const byNames = `${player.firstName || ""} ${player.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  return player.name || "Jugador";
};

const getInitials = (player: MatchCreatorSummary) => {
  const name = getPlayerName(player);
  const chunks = name.split(/\s+/).filter(Boolean);

  if (chunks.length === 0) {
    return "JG";
  }

  return chunks
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("");
};

const MatchPlayersCard: React.FC<MatchPlayersCardProps> = ({
  players,
  playersCapacity,
  currentUserUid,
  matchId,
}) => {
  const setMatchId = useMatchDetailPlayersStore((state) => state.setMatchId);

  const handleAddPlayersClick = () => {
    if (matchId) {
      setMatchId(matchId);
      window.location.href = ROUTES.ADD_PLAYERS_TO_MATCH.path(matchId);
    }
  };

  const slots = Array.from({ length: playersCapacity }, (_, index) => players[index] || null);

  return (
    <BoxContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text variant="h4" className="text-foreground">Jugadores</Text>

        <Badge variant="secondary" className="text-muted-foreground">
          {players.length}/{playersCapacity}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {slots.map((player, index) => {
          if (!player) {
            return (
              <button
                key={`slot-${index}`}
                onClick={handleAddPlayersClick}
                className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="size-14 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-foreground">
                  <Plus className="size-5 text-muted-foreground" />
                </div>
                <Text variant="bodySmall" className="text-muted-foreground text-center">
                  Libre
                </Text>
              </button>
            );
          }

          const isCurrentUser = player.uid === currentUserUid || player.id === currentUserUid;

          return (
            <div key={`${player.id || player.uid}-${index}`} className="flex flex-col items-center gap-2">
              <div className="relative">
                <Avatar size="lg">
                  <AvatarImage src={player.picture || ""} alt={getPlayerName(player)} />
                  <AvatarFallback>{getInitials(player)}</AvatarFallback>
                </Avatar>

                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0">
                  {Number(player.gtr || 0).toFixed(1)}
                </Badge>
              </div>

              <Text variant="bodySmall" className="text-center font-medium text-foreground">
                {isCurrentUser ? "Tu" : getPlayerName(player)}
              </Text>
            </div>
          );
        })}
      </div>
    </BoxContainer>
  );
};

export default MatchPlayersCard;
