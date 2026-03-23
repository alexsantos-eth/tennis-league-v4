import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import useMatches from "../hooks/useMatches";
import MatchCard from "./match-card";
import WeekPick from "./week-pick";

import type { MatchRecord } from "../../../types/match";
import { getDateKey } from "../../../lib/dates";

const normalizeMatchDateKey = (dateOfMatch: string, selectedDate: Date) => {
  const normalizedInput = dateOfMatch.trim().split("T")[0];

  const isoMatch = normalizedInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    return normalizedInput;
  }

  const slashMatch = normalizedInput.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);

  if (slashMatch) {
    const day = String(Number(slashMatch[1])).padStart(2, "0");
    const month = String(Number(slashMatch[2])).padStart(2, "0");
    const parsedYear = slashMatch[3] ? Number(slashMatch[3]) : selectedDate.getFullYear();
    const year = parsedYear < 100 ? parsedYear + 2000 : parsedYear;

    return `${year}-${month}-${day}`;
  }

  return normalizedInput;
};

const Matches = () => {
  const { matches, selectedDate, setSelectedDate, isLoading, hasError } =
    useMatches();

  const getStatusLabel = (match: MatchRecord) =>
    match.isReserved ? "Reservado" : "Abierto";

  const selectedDateKey = getDateKey(selectedDate);

  const filteredMatches = matches.filter((match) => {
    const matchDateKey = normalizeMatchDateKey(match.dateOfMatch, selectedDate);
    return matchDateKey === selectedDateKey;
  });

  return (
    <div className="flex flex-col gap-6">
      <WeekPick selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="flex flex-col gap-6 px-6">
        {!isLoading && !hasError &&
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
            <InfoIcon />
            <AlertDescription>Cargando partidos...</AlertDescription>
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
              <AlertDescription>
                No hay partidos para la fecha seleccionada.
              </AlertDescription>
            </Alert>
          )}
      </div>
    </div>
  );
};

export default Matches;
