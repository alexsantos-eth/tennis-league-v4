import { InfoIcon, LoaderIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";

import MatchCard from "@/views/home/client/components/match-card";
import getStatusLabel from "@/views/home/client/tools/labels";

import type { MatchRecord } from "@/types/match";

interface MatchHistoryListProps {
  matches: MatchRecord[];
  isLoading: boolean;
  hasError: boolean;
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({
  matches,
  isLoading,
  hasError,
}) => {
  return (
    <Stack className="mt-6">
      {!isLoading &&
        !hasError &&
        matches.map((match) => {
          const firstInvitedPlayer = match.invitedPlayers?.[0];
          const invitedPlayerName =
            firstInvitedPlayer?.name ||
            `${firstInvitedPlayer?.firstName ?? ""} ${firstInvitedPlayer?.lastName ?? ""}`.trim();

          const hasInvitedPlayer = Boolean(firstInvitedPlayer && invitedPlayerName);

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
          <AlertDescription>Cargando historial de partidos ...</AlertDescription>
        </Alert>
      )}

      {!isLoading && hasError && (
        <Alert>
          <InfoIcon />
          <AlertDescription>
            No se pudo cargar el historial de partidos.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !hasError && matches.length === 0 && (
        <Alert>
          <InfoIcon />
          <AlertDescription>Aun no hay partidos registrados.</AlertDescription>
        </Alert>
      )}
    </Stack>
  );
};

export default MatchHistoryList;