import type { PublicMatchStatus } from "@/types/match";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, CheckIcon, PlayIcon, ScaleIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { handleConfirmParticipation } from "../tools/match";
import { toast } from "sonner";
import ActionButton from "@/components/ui/action-button";

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
    <ActionButton
      onClick={
        isParticipant && !isConfirmed
          ? handleJoinMatch
          : isParticipant && isConfirmed && matchStatus !== "finished"
            ? goToScoreConfirmation
            : canJoin
              ? handleJoinMatch
              : undefined
      }
      disabled={
        isConfirming ||
        (isParticipant && isConfirmed && matchStatus === "finished")
      }
    >
      {(() => {
        if (isParticipant && !isConfirmed) {
          return (
            <>
              <PlayIcon />
              {isConfirming ? "Confirmando..." : "Unirse al partido"}
            </>
          );
        } else if (isParticipant && isConfirmed && matchStatus !== "finished") {
          return (
            <>
              {matchStatus === "disputed" ? <ScaleIcon /> : <CheckCircleIcon />}
              {matchStatus === "disputed"
                ? "Ver apelación de score"
                : "Confirmar score"}
            </>
          );
        } else if (isParticipant && isConfirmed && matchStatus === "finished") {
          return <>Partido finalizado</>;
        } else if (canJoin) {
          return (
            <>
              <PlayIcon />
              {isConfirming ? "Confirmando..." : "Unirse al partido"}
            </>
          );
        } else {
          return (
            <>
              {!isParticipant && isPrivate && "Este partido es privado"}
              {!isParticipant && !isPrivate && "Partido no disponible"}
            </>
          );
        }
      })()}
    </ActionButton>
  );
};

export default MatchCtaBar;
