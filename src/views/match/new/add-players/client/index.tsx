import {
  GlobeIcon,
  InfoIcon,
  SearchIcon,
  Share2Icon,
  UserRoundIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNewMatchStore } from "@/store/new-match";

import useLoadAddPlayers from "./hooks/useLoadAddPlayers";
import { shareLink } from "@/lib/share";
import Stack from "@/components/ui/stack";
import PlayersList from "./components/players-lists";
import { useFilteredPlayers } from "./hooks/usePlayersList";

const AddPlayersView: React.FC = () => {
  const {
    availablePlayers,
    invitedPlayers,
    matchType,
    playersTab,
    playersSearch,
    isLoadingPlayers,
    friendPlayerIds,
    toggleInvitedPlayer,
    isPlayerInvited,
    setPlayersTab,
    setPlayersSearch,
    matchDocRef,
  } = useNewMatchStore();

  useLoadAddPlayers();

  const guestLimit = matchType === "Singles" ? 1 : 3;
  const invitedGuestsCount = Math.max(invitedPlayers.length - 1, 0);
  const hasReachedGuestLimit = invitedGuestsCount >= guestLimit;

  const filteredPlayers = useFilteredPlayers(
    availablePlayers,
    friendPlayerIds,
    playersTab,
    playersSearch,
  );

  const handlePlayerClick = (player: any) => {
    const isAdded = isPlayerInvited(String(player.uid ?? ""));
    const isAddDisabled = !isAdded && hasReachedGuestLimit;
    if (!isAddDisabled) {
      toggleInvitedPlayer(player);
    }
  };

  const shareInvitation = () => {
    shareLink(
      `${window.location.origin}/match/${matchDocRef?.id}`,
      "Invitación compartida",
    );
  };

  return (
    <Stack className="h-full overflow-scroll pb-22" noPx>
      <Stack className="py-4 bg-background">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={playersSearch}
            onChange={(event) => setPlayersSearch(event.target.value)}
            placeholder="Buscar por nombre o nivel"
            className="pl-9 rounded-2xl"
          />
        </div>

        <Tabs value={playersTab} className="bg-background w-full">
          <TabsList className="w-full p-0 gap-2">
            <TabsTrigger
              value="Amigos"
              className="h-8"
              onClick={() => setPlayersTab("Amigos")}
            >
              <UserRoundIcon />
              Amigos
            </TabsTrigger>
            <TabsTrigger
              value="Global"
              className="h-8"
              onClick={() => setPlayersTab("Global")}
            >
              <GlobeIcon />
              Global
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Stack>

      <Stack className="mb-8">
        {hasReachedGuestLimit && (
          <Alert>
            <InfoIcon className="h-4 w-4 text-primary" />
            <AlertDescription>
              {matchType === "Singles"
                ? "En Singles solo puedes invitar 1 jugador."
                : "En Doubles puedes invitar hasta 3 jugadores."}
            </AlertDescription>
          </Alert>
        )}

        <BoxContainer
          title={playersTab === "Amigos" ? "Lista de amigos" : "Lista global"}
          className="gap-6"
        >
          <PlayersList
            players={filteredPlayers}
            isLoading={isLoadingPlayers}
            onPlayerClick={handlePlayerClick}
            isPlayerSelected={(player) =>
              isPlayerInvited(String(player.uid ?? ""))
            }
            selectionMode="button"
            buttonLabel="Añadir"
            isButtonDisabled={(player) => {
              const isAdded = isPlayerInvited(String(player.uid ?? ""));
              return !isAdded && hasReachedGuestLimit;
            }}
          />
        </BoxContainer>

        <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t border-border z-10">
          <Button
            type="button"
            size="lg"
            onClick={shareInvitation}
            className="h-12 rounded-2xl w-full text-base font-semibold"
          >
            <Share2Icon />
            Compartir invitacion
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

export default AddPlayersView;
