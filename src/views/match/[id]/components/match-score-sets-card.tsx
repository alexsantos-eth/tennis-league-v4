import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { getInitials } from "@/views/match/new/add-players/client/hooks/usePlayersList";

import type { MatchCreatorSummary, MatchSetScore } from "@/types/match";

const getPlayerId = (player: MatchCreatorSummary) =>
  String(player.uid || player.id || "").trim();

const getPlayerName = (player?: MatchCreatorSummary) => {
  const byNames = `${player?.firstName || ""} ${player?.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  return player?.name || "Jugador";
};

interface MatchScoreSetsCardProps {
  title?: string;
  description?: string;
  setsCount: number;
  sets: MatchSetScore[];
  players: MatchCreatorSummary[];
  currentUserUid?: string;
  isReadOnly?: boolean;
  onChangeSetsCount?: (nextCount: number) => void;
  onChangeSetScore?: (
    setIndex: number,
    side: "teamA" | "teamB",
    value: string,
  ) => void;
}

const MatchScoreSetsCard: React.FC<MatchScoreSetsCardProps> = ({
  title = "Cantidad de sets",
  description,
  setsCount,
  sets,
  players,
  currentUserUid,
  isReadOnly = false,
  onChangeSetsCount,
  onChangeSetScore,
}) => {
  const currentUserId = String(currentUserUid || "").trim();

  const userTeamOnMatch = players.find(
    (player) => getPlayerId(player) === currentUserId,
  );

  const firstEnemyPlayer = players.find(
    (player) =>
      getPlayerId(player) !== currentUserId &&
      ((userTeamOnMatch?.team === "A" && player.team === "B") ||
        (userTeamOnMatch?.team === "B" && player.team === "A")),
  );

  return (
    <BoxContainer className="gap-4" title={title} description={description}>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          {!isReadOnly ? (
            <div className="flex items-center gap-2 h-max">
              {setsCount > 1 && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="text-muted-foreground"
                  onClick={() => onChangeSetsCount?.(setsCount - 1)}
                >
                  <MinusCircleIcon />
                </Button>
              )}

              <div>
                <Text variant="bodySmall" className="text-center font-medium">
                  {setsCount}
                </Text>
              </div>

              {setsCount < 5 && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="text-muted-foreground"
                  onClick={() => onChangeSetsCount?.(setsCount + 1)}
                >
                  <PlusCircleIcon />
                </Button>
              )}
            </div>
          ) : (
            <div className="h-7" />
          )}

          <div className="flex flex-col gap-1">
            <div className="h-9 gap-2 flex items-center">
              <Avatar size="sm">
                <AvatarImage
                  src={userTeamOnMatch?.picture || ""}
                  alt={getPlayerName(userTeamOnMatch)}
                />
                <AvatarFallback>
                  {getInitials(userTeamOnMatch?.firstName)}
                </AvatarFallback>
              </Avatar>
              <Text
                variant="bodySmall"
                className={cn(
                  userTeamOnMatch?.team === "A" ? "font-bold" : "font-medium",
                )}
              >
                A
              </Text>
            </div>

            <Separator />

            <div className="h-9 gap-2 flex items-center">
              <Avatar size="sm">
                <AvatarImage
                  src={firstEnemyPlayer?.picture || ""}
                  alt={getPlayerName(firstEnemyPlayer)}
                />
                <AvatarFallback>
                  {getInitials(firstEnemyPlayer?.firstName)}
                </AvatarFallback>
              </Avatar>

              <Text
                variant="bodySmall"
                className={cn(
                  firstEnemyPlayer?.team === "B" ? "font-bold" : "font-medium",
                )}
              >
                B
              </Text>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {sets.map((setScore, index) => (
            <Stack
              noPx
              key={`set-${index + 1}`}
              className="gap-2 items-center w-10"
            >
              <Text variant="bodySmall" className="font-medium text-center">
                Set {index + 1}
              </Text>

              <div className="flex flex-col gap-2">
                <InputOTP
                  maxLength={1}
                  value={String(setScore.teamA || 0)}
                  onChange={(value) =>
                    isReadOnly
                      ? undefined
                      : onChangeSetScore?.(index, "teamA", value)
                  }
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      className="font-bold w-10 h-10 text-2xl border-primary text-primary"
                      index={0}
                    />
                  </InputOTPGroup>
                </InputOTP>

                <InputOTP
                  maxLength={1}
                  value={String(setScore.teamB || 0)}
                  onChange={(value) =>
                    isReadOnly
                      ? undefined
                      : onChangeSetScore?.(index, "teamB", value)
                  }
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      className="font-bold w-10 h-10 text-2xl border-primary text-primary"
                      index={0}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Stack>
          ))}
        </div>
      </div>
    </BoxContainer>
  );
};

export default MatchScoreSetsCard;
