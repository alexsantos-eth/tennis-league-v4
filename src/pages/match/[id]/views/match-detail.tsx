import { InfoIcon } from "lucide-react";
import { Else, If, Then } from "react-if";

import { Alert, AlertDescription } from "../../../../components/ui/alert";
import MatchCtaBar from "./components/match-cta-bar";
import MatchHero from "./components/match-hero";
import MatchInfoCard from "./components/match-info-card";
import MatchPlayersCard from "./components/match-players-card";
import MatchSkillCard from "./components/match-skill-card";
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
      <If condition={isLoading}>
        <Then>
          <div className="p-6">
            <Alert>
              <InfoIcon />
              <AlertDescription>Cargando partido...</AlertDescription>
            </Alert>
          </div>
        </Then>
      </If>

      <If condition={!isLoading && hasError}>
        <Then>
          <div className="p-6">
            <Alert>
              <InfoIcon />
              <AlertDescription>
                No pudimos cargar los datos del partido.
              </AlertDescription>
            </Alert>
          </div>
        </Then>
      </If>

      <If condition={!isLoading && !hasError && Boolean(match)}>
        <Then>
          {match && (
            <>
              <MatchHero match={match} />

              <div className="px-6 py-6 flex bg-muted flex-col gap-4 relative z-2">
                <MatchInfoCard match={match} />
                <MatchPlayersCard
                  players={players}
                  playersCapacity={playersCapacity}
                  currentUserUid={currentUser?.uid}
                />
                <MatchSkillCard match={match} />
              </div>

              <MatchCtaBar
                canJoin={canJoin}
                isParticipant={isCurrentUserParticipant}
                isPrivate={match.isPrivate}
              />
            </>
          )}
        </Then>

        <Else>
          <If condition={!isLoading && !hasError && !match}>
            <Then>
              <div className="p-6">
                <Alert>
                  <InfoIcon />
                  <AlertDescription>Partido no encontrado.</AlertDescription>
                </Alert>
              </div>
            </Then>
          </If>
        </Else>
      </If>
    </div>
  );
};

export default MatchDetailPage;
