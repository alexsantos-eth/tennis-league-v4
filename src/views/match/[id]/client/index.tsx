import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import MatchCtaBar from "./components/match-cta-bar.tsx";
import MatchHero from "./components/match-hero.tsx";
import MatchInfoCard from "./components/match-info-card.tsx";
import MatchPlayersCard from "./components/match-players-card.tsx";
import MatchSkillCard from "./components/match-skill-card.tsx";
import useMatchDetail from "./hooks/use-match-detail.tsx";

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
  } = useMatchDetail(matchId);

  return (
    <div className="w-full h-full overflow-scroll pb-28">
      {isLoading && (
        <div className="p-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando partido...</AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && hasError && (
        <div className="p-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>
              No pudimos cargar los datos del partido.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !hasError && Boolean(match) && (
        <>
          {match && (
            <>
              <MatchHero match={match} />

              <div className="px-6 py-6 flex bg-muted flex-col gap-4 relative z-2">
                <MatchInfoCard match={match} />
                <MatchPlayersCard
                  players={players}
                  playersCapacity={playersCapacity}
                  currentUserUid={currentUser?.uid}
                  matchId={matchId}
                />
                <MatchSkillCard match={match} />
              </div>

              <MatchCtaBar
                canJoin={canJoin}
                isParticipant={isCurrentUserParticipant}
                matchId={matchId}
                matchStatus={match.status}
                isPrivate={match.isPrivate}
              />
            </>
          )}
        </>
      )}

      {!isLoading && !hasError && !match && (
        <div className="p-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>Partido no encontrado.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default MatchDetailPage;
