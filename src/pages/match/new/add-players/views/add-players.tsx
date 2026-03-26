import { useEffect } from "react";
import {
  GlobeIcon,
  InfoIcon,
  Share2Icon,
  UserRoundIcon,
  SearchIcon,
} from "lucide-react";

import BoxContainer from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";
import { useAuthStore } from "@/store/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PlayersList from "@/pages/match/add-players-common/players-list";
import { useFilteredPlayers } from "@/pages/match/add-players-common/use-players-list";

const AddPlayersView: React.FC = () => {
  const availablePlayers = useNewMatchStore((state) => state.availablePlayers);
  const friendPlayerIds = useNewMatchStore((state) => state.friendPlayerIds);
  const invitedPlayers = useNewMatchStore((state) => state.invitedPlayers);
  const matchType = useNewMatchStore((state) => state.matchType);
  const playersTab = useNewMatchStore((state) => state.playersTab);
  const playersSearch = useNewMatchStore((state) => state.playersSearch);
  const isLoadingPlayers = useNewMatchStore((state) => state.isLoadingPlayers);
  const setPlayersTab = useNewMatchStore((state) => state.setPlayersTab);
  const setPlayersSearch = useNewMatchStore((state) => state.setPlayersSearch);
  const loadAvailablePlayers = useNewMatchStore(
    (state) => state.loadAvailablePlayers,
  );
  const toggleInvitedPlayer = useNewMatchStore(
    (state) => state.toggleInvitedPlayer,
  );
  const isPlayerInvited = useNewMatchStore((state) => state.isPlayerInvited);
  const bootstrapCurrentUserPlayer = useNewMatchStore(
    (state) => state.bootstrapCurrentUserPlayer,
  );
  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);

  useEffect(() => {
    bootstrapCurrentUserPlayer();
    void loadAvailablePlayers();
  }, [bootstrapCurrentUserPlayer, loadAvailablePlayers, currentUserUid]);

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

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-scroll">
      <div className="w-full flex flex-col gap-6 px-6 py-4 bg-background">
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
      </div>

      <div className="px-6 flex flex-col gap-6 mb-8">
        {hasReachedGuestLimit && (
          <Alert>
            <InfoIcon />
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

        <Button
          type="button"
          size="lg"
          className="h-12 rounded-2xl w-full text-base font-semibold"
        >
          <Share2Icon />
          Compartir invitacion
        </Button>
      </div>
    </div>
  );
};

export default AddPlayersView;
