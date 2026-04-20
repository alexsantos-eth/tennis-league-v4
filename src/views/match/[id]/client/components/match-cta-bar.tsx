import type { PublicMatchStatus } from "@/types/match";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, CheckIcon, PlayIcon, ScaleIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { handleConfirmParticipation } from "../tools/match";
import { toast } from "sonner";

interface MatchCtaBarProps {
  canJoin: boolean;
  isParticipant: boolean;
  matchId: string;
  matchStatus: PublicMatchStatus;
  isPrivate?: boolean;
  isCreator?: boolean;
  isConfirmed?: boolean;
}

const MatchCtaBar: React.FC<MatchCtaBarProps> = ({
  canJoin,
  isParticipant,
  matchId,
  matchStatus,
  isPrivate,
  isCreator,
  isConfirmed,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { currentUser } = useAuthStore();

  const goToScoreConfirmation = () => {
    window.location.href = `/match/${matchId}/confirm-score`;
  };

  const handleJoinMatch = async () => {
    if (!currentUser?.uid) {
      toast.error("Debes estar autenticado para unirte a un partido");
      return;
    }

    setIsConfirming(true);
    try {
      await handleConfirmParticipation(matchId, currentUser.uid);
      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al unirse al partido";
      console.error("Error confirming participation:", message);
      toast.error(message);
    } finally {
      setIsConfirming(false);
      toast.success("¡Te has unido al partido!");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t border-border z-10">
      {isParticipant && !isConfirmed ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          onClick={handleJoinMatch}
          disabled={isConfirming}
        >
          <PlayIcon />
          {isConfirming ? "Confirmando..." : "Unirse al partido"}
        </Button>
      ) : isParticipant && isConfirmed && matchStatus !== "finished" ? (
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
      ) : isParticipant && isConfirmed && matchStatus === "finished" ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          disabled
          variant="secondary"
        >
          Partido finalizado
        </Button>
      ) : canJoin ? (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          onClick={handleJoinMatch}
          disabled={isConfirming}
        >
          <PlayIcon />
          {isConfirming ? "Confirmando..." : "Unirse al partido"}
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          className="w-full text-lg h-12 rounded-2xl"
          disabled
          variant="secondary"
        >
          {!isParticipant && isPrivate && "Este partido es privado"}
          {!isParticipant && !isPrivate && "Partido no disponible"}
        </Button>
      )}
    </div>
  );
};

export default MatchCtaBar;
