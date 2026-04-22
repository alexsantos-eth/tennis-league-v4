import { InfoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";

import MatchScoreSetsCard from "../components/match-score-sets-card";
import MatchCtaBar from "./components/match-cta-bar";
import MatchHero from "./components/match-hero";
import MatchInfoCard from "./components/match-info-card";
import MatchPlayersCard from "./components/match-players-card";
import MatchSkillCard from "./components/match-skill-card";
import useMatchDetail from "./hooks/useMatchDetail.ts";

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const opacity = Math.min(scrollY / 120, 1);
      setScrollOpacity(opacity);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full h-full overflow-scroll pb-28"
      ref={scrollContainerRef}
    >
      {isLoading && (
        <Stack className="py-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando partido...</AlertDescription>
          </Alert>
        </Stack>
      )}

      {!isLoading && hasError && (
        <Stack className="py-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>
              No pudimos cargar los datos del partido.
            </AlertDescription>
          </Alert>
        </Stack>
      )}

      {!isLoading && !hasError && Boolean(match) && match && (
        <>
          <MatchHero match={match} scrollOpacity={scrollOpacity} />

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

      {!isLoading && !hasError && !match && (
        <Stack className="py-6">
          <Alert>
            <InfoIcon />
            <AlertDescription>Partido no encontrado.</AlertDescription>
          </Alert>
        </Stack>
      )}
    </div>
  );
};

export default MatchDetailPage;
