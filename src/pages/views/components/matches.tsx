import { InfoIcon, LoaderIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";
import { getDateKey, normalizeMatchDateKey } from "@/lib/dates";

import useMatches from "../hooks/useMatches";
import MatchCard from "./match-card";
import WeekPick from "./week-pick";

import type { MatchRecord } from "@/types/match";

const Matches = () => {
  const { matches, selectedDate, setSelectedDate, isLoading, hasError } =
    useMatches();

  const getStatusLabel = (match: MatchRecord) => {
    switch (match.status) {
      case "reserved":
        return "Reservado";
      case "disputed":
        return "En apelacion";
      case "finished":
        return "Finalizado";
      default:
        return "Abierto";
    }
  };

  const selectedDateKey = getDateKey(selectedDate);

  const filteredMatches = matches.filter((match) => {
    const matchDateKey = normalizeMatchDateKey(match.dateOfMatch, selectedDate);
    return matchDateKey === selectedDateKey;
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
            <Alert>
              <InfoIcon />
              <AlertDescription>No hay partidos para este día</AlertDescription>
            </Alert>
          )}
      </Stack>
    </Stack>
  );
};

export default Matches;
