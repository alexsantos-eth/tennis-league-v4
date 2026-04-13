import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";
import { PlusIcon, InfoIcon, XIcon, LoaderIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from "@/types/users";
import {
  formatGtr,
  getInitials,
  getPlayerDisplayName,
} from "./hooks/usePlayersList";

interface PlayersListProps {
  players: User[];
  isLoading: boolean;
  onPlayerClick: (player: User) => void;
  isPlayerSelected?: (player: User) => boolean;
  selectionMode?: "checkbox" | "button"; // checkbox for multi-select, button for single toggle
  buttonLabel?: string;
  selectedCount?: number;
  isButtonDisabled?: (player: User) => boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  isLoading,
  onPlayerClick,
  isPlayerSelected = () => false,
  selectionMode = "checkbox",
  buttonLabel = "Añadir",
  selectedCount = 0,
  isButtonDisabled = () => false,
}) => {
  if (isLoading) {
    return (
      <Alert>
        <LoaderIcon />
        <AlertDescription>Cargando jugadores...</AlertDescription>
      </Alert>
    );
  }

  if (players.length === 0) {
    return (
      <Alert>
        <InfoIcon />
        <AlertDescription>No se encontraron jugadores.</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {players.map((player) => {
        const playerName = getPlayerDisplayName(player);
        const isSelected = isPlayerSelected(player);

        if (selectionMode === "checkbox") {
          return (
            <BoxContainer
              key={`${player.uid}`}
              className={`flex items-center gap-4 cursor-pointer transition-all ${
                isSelected ? "bg-primary/10" : ""
              }`}
              onClick={() => onPlayerClick(player)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={player.picture || ""} alt={playerName} />
                  <AvatarFallback className="bg-gray-200 font-semibold text-foreground">
                    {getInitials(playerName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <Text variant="body" className="font-medium text-foreground">
                  {playerName}
                </Text>
                <Text variant="bodySmall" className="text-muted-foreground">
                  GTR: {formatGtr(Number(player.utr || 0))}
                </Text>
              </div>

              {isSelected && (
                <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                  <PlusIcon className="size-4 text-primary-foreground" />
                </div>
              )}
            </BoxContainer>
          );
        }

        // Button mode for add-players
        return (
          <div
            key={player.uid}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-4 min-w-0">
              <Avatar size="default">
                <AvatarImage src={player.picture} alt={playerName} />
                <AvatarFallback className="bg-gray-200 text-foreground font-semibold">
                  {getInitials(playerName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <Text
                  variant="body"
                  className="text-foreground font-semibold truncate"
                >
                  {playerName}
                </Text>
                <Text variant="bodySmall" className="text-foreground/80">
                  {formatGtr(Number(player.utr) || 0)}
                </Text>
              </div>
            </div>

            <Button
              type="button"
              variant={isSelected ? "secondary" : "outline"}
              size="default"
              disabled={isButtonDisabled(player)}
              onClick={() => onPlayerClick(player)}
            >
              {isSelected ? (
                "Añadido"
              ) : (
                <>
                  <PlusIcon />
                  {buttonLabel}
                </>
              )}

              {isSelected && <XIcon />}
            </Button>
          </div>
        );
      })}
    </>
  );
};

export default PlayersList;
