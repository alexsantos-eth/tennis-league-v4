import { InfoIcon, LoaderIcon, PlusIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";

import useMatches from "../hooks/useMatches";
import MatchCard from "./match-card";
import WeekPick from "./week-pick";

import getStatusLabel from "../tools/labels";
import { getFilteredMatches } from "../tools/dates";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

const Matches = () => {
  const { matches, selectedDate, setSelectedDate, isLoading, hasError } =
    useMatches();
  const { currentUser } = useAuthStore();

  const filteredMatches = getFilteredMatches({
    matches,
    selectedDate,
    currentUserId: currentUser?.uid,
  });

  return (
    <Stack noPx>
      <WeekPick selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <Stack>
        {!isLoading &&
          !hasError &&
          filteredMatches.map((match) => {
            const firstInvitedPlayer = match.invitedPlayers?.[0];
            const invitedPlayerName =
              firstInvitedPlayer?.name ||
              `${firstInvitedPlayer?.firstName ?? ""} ${firstInvitedPlayer?.lastName ?? ""}`.trim();

            const hasInvitedPlayer = Boolean(
              firstInvitedPlayer && invitedPlayerName,
            );

            return (
              <a key={match.id} href={`/match/${match.id}`}>
                <MatchCard
                  time={match.timeOfMatch}
                  type={match.matchType}
                  format={match.matchFormat}
                  category={`${match.sport} · ${match.location}`}
                  status={getStatusLabel(match)}
                  playerOne={{
                    name:
                      match.createdBy.name ||
                      `${match.createdBy.firstName ?? ""} ${match.createdBy.lastName ?? ""}`.trim() ||
                      "Jugador",
                    gtr: match.createdBy.gtr.toFixed(2),
                  }}
                  playerTwo={{
                    name: hasInvitedPlayer
                      ? invitedPlayerName
                      : match.isPrivate
                        ? "Privado"
                        : "Pendiente",
                    gtr: hasInvitedPlayer
                      ? Number(firstInvitedPlayer?.gtr || 0).toFixed(2)
                      : `${match.skillRange.min.toFixed(2)}`,
                    detailLabel: "GTR",
                  }}
                />
              </a>
            );
          })}

        {isLoading && (
          <Alert>
            <LoaderIcon />
            <AlertDescription>Cargando partidos ...</AlertDescription>
          </Alert>
        )}

        {!isLoading && hasError && (
          <Alert>
            <InfoIcon />
            <AlertDescription>
              No se pudieron cargar los partidos creados.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !hasError && matches.length === 0 && (
          <Alert>
            <InfoIcon />
            <AlertDescription>Aun no hay partidos creados.</AlertDescription>
          </Alert>
        )}

        {!isLoading &&
          !hasError &&
          matches.length > 0 &&
          filteredMatches.length === 0 && (
            <Alert variant="default">
              <div className="flex gap-2 items-center">
                <InfoIcon size={15} />
                <AlertDescription>
                  No hay partidos para este día
                </AlertDescription>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Text variant="body" className="font-semibold">
                  ¿Te gustaría jugar hoy?
                </Text>
                <a href="/match/new" className="w-full">
                  <Button variant="default" className="w-full" size="lg">
                    <PlusIcon />
                    Crea un partido
                  </Button>
                </a>
              </div>
            </Alert>
          )}
      </Stack>
    </Stack>
  );
};

export default Matches;
