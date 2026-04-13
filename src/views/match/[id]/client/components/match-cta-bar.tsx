import type { PublicMatchStatus } from "@/types/match";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, CheckIcon, PlayIcon, ScaleIcon } from "lucide-react";

interface MatchCtaBarProps {
  canJoin: boolean;
  isParticipant: boolean;
  matchId: string;
  matchStatus: PublicMatchStatus;
  isPrivate?: boolean;
}

const MatchCtaBar: React.FC<MatchCtaBarProps> = ({
  canJoin,
  isParticipant,
  matchId,
  matchStatus,
  isPrivate,
}) => {
  const goToScoreConfirmation = () => {
    window.location.href = `/match/${matchId}/confirm-score`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t border-border z-10">
      {isParticipant && matchStatus !== "finished" ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          onClick={goToScoreConfirmation}
        >
          {matchStatus === "disputed" ? <ScaleIcon /> : <CheckCircleIcon />}

          {matchStatus === "disputed"
            ? "Ver apelación de score"
            : "Confirmar score"}
        </Button>
      ) : isParticipant && matchStatus === "finished" ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          disabled
        >
          Partido finalizado
        </Button>
      ) : canJoin ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
        >
          <PlayIcon />
          Unirse al partido
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          disabled
        >
          {!isParticipant && isPrivate && "Este partido es privado"}
          {!isParticipant && !isPrivate && "Partido no disponible"}
        </Button>
      )}
    </div>
  );
};

export default MatchCtaBar;
