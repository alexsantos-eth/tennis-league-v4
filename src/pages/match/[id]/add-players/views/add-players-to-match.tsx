import React, { useEffect } from "react";
import {
  GlobeIcon,
  InfoIcon,
  UserRoundIcon,
  SearchIcon,
} from "lucide-react";

import BoxContainer from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { useMatchDetailPlayersStore } from "@/store/match-detail-players";
import { useAuthStore } from "@/store/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { updateMatchPlayers } from "@/firebase/match";
import type { MatchCreatorSummary } from "@/types/match";
import PlayersList from "@/pages/match/add-players/players-list";
import { useFilteredPlayers } from "@/pages/match/add-players/hooks/usePlayersList";

const mapUserToMatchPlayer = (user: any): MatchCreatorSummary => {
  const displayName = user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Jugador";
  return {
    id: String(user.uid ?? ""),
    uid: user.uid,
    name: displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    picture: user.picture,
    gtr: Number(user.utr) || 0,
  };
};

const AddPlayersToMatchView: React.FC = () => {
  const matchId = useMatchDetailPlayersStore((state) => state.matchId);
  const availablePlayers = useMatchDetailPlayersStore(
    (state) => state.availablePlayers
  );
  const friendPlayerIds = useMatchDetailPlayersStore(
    (state) => state.friendPlayerIds
  );
  const playersTab = useMatchDetailPlayersStore((state) => state.playersTab);
  const playersSearch = useMatchDetailPlayersStore(
    (state) => state.playersSearch
  );
  const isLoadingPlayers = useMatchDetailPlayersStore(
    (state) => state.isLoadingPlayers
  );
  const setPlayersTab = useMatchDetailPlayersStore(
    (state) => state.setPlayersTab
  );
  const setPlayersSearch = useMatchDetailPlayersStore(
    (state) => state.setPlayersSearch
  );
  const loadAvailablePlayers = useMatchDetailPlayersStore(
    (state) => state.loadAvailablePlayers
  );
  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);

  const [selectedPlayers, setSelectedPlayers] = React.useState<
    MatchCreatorSummary[]
  >([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    void loadAvailablePlayers();
  }, [loadAvailablePlayers]);

  const filteredPlayers = useFilteredPlayers(
    availablePlayers,
    friendPlayerIds,
    playersTab,
    playersSearch,
  );

  const togglePlayer = (player: MatchCreatorSummary) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.some(
        (p) => p.id === player.id || p.uid === player.uid
      );
      if (isSelected) {
        return prev.filter((p) => p.id !== player.id && p.uid !== player.uid);
      }
      return [...prev, player];
    });
  };

  const isPlayerSelected = (player: MatchCreatorSummary) => {
    return selectedPlayers.some(
      (p) => p.id === player.id || p.uid === player.uid
    );
  };

  const handleSubmit = async () => {
    if (!matchId || selectedPlayers.length === 0) {
      toast.error("Debes seleccionar al menos un jugador");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMatchPlayers(matchId, selectedPlayers);
      toast.success("Jugadores agregados correctamente");
      window.history.back();
    } catch (error) {
      console.error("Error adding players to match:", error);
      toast.error("Error al agregar jugadores");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-28 overflow-scroll h-full no-scrollbar">
      <div className="px-6 py-6 flex bg-muted flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SearchIcon className="size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar jugadores..."
              value={playersSearch}
              onChange={(e) => setPlayersSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          <Tabs
            value={playersTab}
            onValueChange={(value) => setPlayersTab(value as "Amigos" | "Global")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Amigos" className="flex items-center gap-2">
                <UserRoundIcon className="size-4" />
                Amigos
              </TabsTrigger>
              <TabsTrigger value="Global" className="flex items-center gap-2">
                <GlobeIcon className="size-4" />
                Global
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoadingPlayers && (
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando jugadores...</AlertDescription>
          </Alert>
        )}

        {!isLoadingPlayers && filteredPlayers.length === 0 && (
          <Alert>
            <InfoIcon />
            <AlertDescription>
              {playersSearch
                ? "No encontramos jugadores con ese nombre"
                : "No hay jugadores disponibles"}
            </AlertDescription>
          </Alert>
        )}

        {!isLoadingPlayers && filteredPlayers.length > 0 && (
          <PlayersList
            players={filteredPlayers}
            isLoading={false}
            onPlayerClick={(player) =>
              togglePlayer(mapUserToMatchPlayer(player))
            }
            isPlayerSelected={(player) =>
              isPlayerSelected(mapUserToMatchPlayer(player))
            }
            selectionMode="checkbox"
          />
        )}

        {selectedPlayers.length > 0 && (
          <BoxContainer className="fixed bottom-6 left-6 right-6 flex flex-col gap-2">
            <Text variant="body" className="font-medium text-foreground">
              {selectedPlayers.length} jugador
              {selectedPlayers.length > 1 ? "es" : ""} seleccionado
              {selectedPlayers.length > 1 ? "s" : ""}
            </Text>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Agregando..." : "Agregar jugadores"}
            </Button>
          </BoxContainer>
        )}
      </div>
    </div>
  );
};

export default AddPlayersToMatchView;
