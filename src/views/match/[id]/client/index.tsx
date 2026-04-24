import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";

import MatchScoreSetsCard from "../components/match-score-sets-card";
import MatchCtaBar from "./components/match-cta-bar";
import MatchHero from "./components/match-hero";
import MatchInfoCard from "./components/match-info-card";
import MatchPlayersCard from "./components/match-players-card";
import MatchSkillCard from "./components/match-skill-card";
import useMatchDetail from "./hooks/useMatchDetail.ts";
import ActionButton from "@/components/ui/action-button.tsx";

interface MatchDetailPageProps {
  matchId: string;
}

const MatchDetailPage: React.FC<MatchDetailPageProps> = ({ matchId }) => {
  const {
    match,
    isLoading,
    hasError,
    players,
    playersCapacity,
    currentUser,
    canJoin,
    isCurrentUserParticipant,
    isCurrentUserCreator,
    isCurrentUserConfirmed,
  } = useMatchDetail(matchId);

  return (
    <div className="w-full h-full pb-28 -mt-16">
      {isLoading && (
        <Stack className="py-6 mt-16">
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando partido...</AlertDescription>
          </Alert>
        </Stack>
      )}

      {!isLoading && hasError && (
        <Stack className="py-6 mt-16">
          <Alert>
            <InfoIcon />
            <AlertDescription>
              No pudimos cargar los datos del partido.
            </AlertDescription>
          </Alert>
        </Stack>
      )}

      {!isLoading && !hasError && !match && (
        <Stack className="py-6 mt-16">
          <Alert>
            <InfoIcon />
            <AlertDescription>Partido no encontrado.</AlertDescription>
          </Alert>
        </Stack>
      )}

      {!isLoading && !hasError && Boolean(match) && match && (
        <>
          <MatchHero match={match} />

          <Stack className="py-6 bg-muted relative z-2 -mb-4">
            <MatchInfoCard match={match} />

            {match.status === "finished" && (
              <MatchScoreSetsCard
                title="Resultado final"
                description="Este partido ya fue finalizado."
                setsCount={match.scoreBoard?.finalScore?.setsCount || 0}
                sets={match.scoreBoard?.finalScore?.sets || []}
                players={players}
                currentUserUid={currentUser?.uid}
                isReadOnly
              />
            )}

            <MatchPlayersCard
              players={players}
              playersCapacity={playersCapacity}
              currentUserUid={currentUser?.uid}
              matchId={matchId}
            />

            {match.matchFormat === "Ranking" && (
              <MatchSkillCard match={match} />
            )}
          </Stack>

          <MatchCtaBar
            canJoin={canJoin}
            isParticipant={isCurrentUserParticipant}
            matchId={matchId}
            matchStatus={match.status}
            isPrivate={match.isPrivate}
            isCreator={isCurrentUserCreator}
            isConfirmed={isCurrentUserConfirmed}
          />
        </>
      )}
    </div>
  );
};

export default MatchDetailPage;
