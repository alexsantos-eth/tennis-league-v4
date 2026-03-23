import { useEffect, useMemo } from "react";
import {
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  Share2Icon,
  UserRoundIcon,
} from "lucide-react";

import BoxContainer from "@/components/ui/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";
import { useAuthStore } from "@/store/auth";
import { Else, If, Then } from "react-if";
import { Alert, AlertDescription } from "@/components/ui/alert";

const getInitials = (name: string) => {
  const [first = "", second = ""] = name.trim().split(" ");
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || "PL";
};

const formatGtr = (value: number) => {
  if (!Number.isFinite(value)) {
    return "Sin ranking";
  }

  return value > 0 ? Number(value).toFixed(2) : "Sin ranking";
};

const AddPlayersView: React.FC = () => {
  const availablePlayers = useNewMatchStore((state) => state.availablePlayers);
  const friendPlayerIds = useNewMatchStore((state) => state.friendPlayerIds);
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

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = playersSearch.trim().toLowerCase();

    const scopedPlayers =
      playersTab === "Amigos"
        ? availablePlayers.filter((player) =>
            friendPlayerIds.includes(String(player.uid ?? "")),
          )
        : availablePlayers;

    if (!normalizedQuery) {
      return scopedPlayers;
    }

    return scopedPlayers.filter((player) => {
      const name = (
        player.name || `${player.firstName ?? ""} ${player.lastName ?? ""}`
      ).toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        String(player.utr ?? "").includes(normalizedQuery)
      );
    });
  }, [availablePlayers, friendPlayerIds, playersSearch, playersTab]);

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
        <BoxContainer
          title={playersTab === "Amigos" ? "Lista de amigos" : "Lista global"}
          className="gap-6"
        >
          <If condition={isLoadingPlayers}>
            <Then>
              <Alert>
                <InfoIcon />
                <AlertDescription> Cargando jugadores...</AlertDescription>
              </Alert>
            </Then>
          </If>

          <If condition={!isLoadingPlayers && filteredPlayers.length === 0}>
            <Then>
              <Alert>
                <InfoIcon />
                <AlertDescription>
                  No se encontraron jugadores.
                </AlertDescription>
              </Alert>
            </Then>
          </If>

          <If condition={!isLoadingPlayers}>
            <Then>
              {filteredPlayers.map((player) => {
                const name = (
                  player.name ||
                  `${player.firstName ?? ""} ${player.lastName ?? ""}`
                ).trim();
                const isAdded = isPlayerInvited(String(player.uid ?? ""));

                return (
                  <div
                    key={player.uid}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar size="default">
                        <AvatarImage src={player.picture} alt={name} />
                        <AvatarFallback className="bg-gray-200 text-foreground font-semibold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <Text
                          variant="body"
                          className="text-foreground font-semibold truncate"
                        >
                          {name || "Jugador sin nombre"}
                        </Text>
                        <Text
                          variant="bodySmall"
                          className="text-foreground/80"
                        >
                          {formatGtr(Number(player.utr) || 0)}
                        </Text>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant={isAdded ? "secondary" : "outline"}
                      size="default"
                      onClick={() => toggleInvitedPlayer(player)}
                    >
                      <If condition={isAdded}>
                        <Then>Añadido</Then>
                        <Else>
                          <PlusIcon />
                          Añadir
                        </Else>
                      </If>
                    </Button>
                  </div>
                );
              })}
            </Then>
          </If>
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
