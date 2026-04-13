import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

import { getInitials, getPlayerName } from "../tools/labels";

import type { MatchCreatorSummary } from "@/types/match";
import { cn } from "@/lib/styles";
interface MatchPlayersCardProps {
  players: MatchCreatorSummary[];
  playersCapacity: number;
  currentUserUid?: string;
  matchId?: string;
}

const MatchPlayersCard: React.FC<MatchPlayersCardProps> = ({
  players,
  playersCapacity,
  currentUserUid,
}) => {
  const slots = Array.from(
    { length: playersCapacity },
    (_, index) => players[index] || null,
  );

  return (
    <BoxContainer className="flex flex-col gap-4 relative" title="Jugadores">
      <div className="absolute right-4 top-4 z-2">
        <Badge variant="secondary" className="text-muted-foreground">
          {players.length}/{playersCapacity}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {slots.map((player: MatchCreatorSummary | null, index) => {
          const isCurrentUser =
            player?.uid === currentUserUid || player?.id === currentUserUid;

          if (!player) {
            return <div />;
          }

          return (
            <div
              key={`${player.id || player.uid}-${index}`}
              className={cn(
                "flex flex-col items-center gap-4",
                !player.confirmed && !isCurrentUser && "opacity-50",
              )}
            >
              <div className="relative">
                <Avatar size="lg">
                  <AvatarImage
                    src={player.picture || ""}
                    alt={getPlayerName(player)}
                  />
                  <AvatarFallback>{getInitials(player)}</AvatarFallback>
                </Avatar>

                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0">
                  {Number(player.gtr || 0).toFixed(1)}
                </Badge>
              </div>

              <Text
                variant="bodySmall"
                className="text-center font-medium text-foreground"
              >
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
