import { useAuthStore } from "@/store/auth";
import { useLoadMatch } from "./useLoadMatch";
import { useMemo } from "react";
import type { MatchCreatorSummary } from "@/types/match";
import {
  buildScoreSignature,
  clampSetsCount,
  getPlayerId,
  normalizeScoreInput,
} from "../tools/sets";
import {
  createMatchScoreAppeal,
  resolveMatchScoreAppeal,
  submitMatchScoreConfirmation,
} from "@/firebase/match";
import { toast } from "sonner";

interface UseScoreEventsProps {
  matchId: string;
}
const useScoreEvents = ({ matchId }: UseScoreEventsProps) => {
  const {
    match,
    ownConfirmation,
    isLoading,
    hasError,
    setsCount,
    sets,
    appealReason,
    isSubmittingConfirmation,
    isSubmittingAppeal,
    isResolvingAppeal,
    setSets,
    setSetsCount,
    setAppealReason,
    loadMatch,
    setIsSubmittingConfirmation,
    setIsSubmittingAppeal,
    setIsResolvingAppeal,
  } = useLoadMatch({ matchId });

  const currentUser = useAuthStore((state) => state.currentUser);
  const currentUserId = String(currentUser?.uid || "").trim();

  const players = useMemo(() => {
    if (!match) {
      return [] as MatchCreatorSummary[];
    }

    return [match.createdBy, ...(match.invitedPlayers || [])];
  }, [match]);

  const participantIds = useMemo(
    () => Array.from(new Set(players.map(getPlayerId).filter(Boolean))),
    [players],
  );

  const isParticipant = useMemo(
    () => Boolean(currentUserId && participantIds.includes(currentUserId)),
    [currentUserId, participantIds],
  );

  const ownerId = useMemo(
    () => (match ? getPlayerId(match.createdBy) : ""),
    [match],
  );
  const isMatchOwner = Boolean(
    currentUserId && ownerId && currentUserId === ownerId,
  );

  const confirmations = match?.scoreBoard?.confirmations || {};
  const confirmedCount = participantIds.filter((id) =>
    Boolean(confirmations[id]),
  ).length;

  const confirmationSignatures = useMemo(() => {
    const signatures = participantIds
      .map((participantId) => confirmations[participantId])
      .filter(Boolean)
      .map((confirmation) =>
        buildScoreSignature({
          setsCount: confirmation.setsCount,
          sets: confirmation.sets,
        }),
      );

    return Array.from(new Set(signatures));
  }, [confirmations, participantIds]);

  const hasMismatch = confirmationSignatures.length > 1;
  const appeal = match?.scoreBoard?.appeal;
  const hasPendingAppeal = appeal?.status === "pending";

  const onChangeSetsCount = (nextCount: number) => {
    const normalizedCount = clampSetsCount(nextCount);

    setSetsCount(normalizedCount);
    setSets((currentSets) =>
      Array.from({ length: normalizedCount }, (_, index) => ({
        teamA: Number(currentSets[index]?.teamA || 0),
        teamB: Number(currentSets[index]?.teamB || 0),
      })),
    );
  };

  const onChangeSetScore = (
    setIndex: number,
    side: "teamA" | "teamB",
    value: string,
  ) => {
    setSets((currentSets) =>
      currentSets.map((setScore, currentIndex) => {
        if (currentIndex !== setIndex) {
          return setScore;
        }

        const parsedValue = Math.max(0, Math.trunc(Number(value || 0)));

        return {
          ...setScore,
          [side]: Number.isFinite(parsedValue) ? parsedValue : 0,
        };
      }),
    );
  };

  const submitConfirmation = async () => {
    if (!match || !currentUserId) {
      return;
    }

    try {
      setIsSubmittingConfirmation(true);

      await submitMatchScoreConfirmation(
        match.id || matchId,
        currentUserId,
        normalizeScoreInput(setsCount, sets),
      );

      toast.success("Resultado confirmado. Esperando el resto de jugadores.");
      await loadMatch();
    } catch (error) {
      console.error("Error confirming score:", error);
      toast.error("No se pudo confirmar el resultado.");
    } finally {
      setIsSubmittingConfirmation(false);
    }
  };

  const submitAppeal = async () => {
    if (!match || !currentUserId) {
      return;
    }

    if (isMatchOwner) {
      toast.error("El creador del partido no puede crear apelaciones.");
      return;
    }

    try {
      setIsSubmittingAppeal(true);

      await createMatchScoreAppeal(match.id || matchId, currentUserId, {
        reason: appealReason,
        proposedScore: normalizeScoreInput(setsCount, sets),
      });

      setAppealReason("");
      toast.success("Apelación enviada. Esperando decisión del creador.");
      await loadMatch();
    } catch (error) {
      console.error("Error creating appeal:", error);
      toast.error("No se pudo crear la apelación.");
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  const resolveAppeal = async (decision: "accepted" | "rejected") => {
    if (!match || !currentUserId) {
      return;
    }

    try {
      setIsResolvingAppeal(true);

      await resolveMatchScoreAppeal(
        match.id || matchId,
        currentUserId,
        decision,
      );

      toast.success(
        decision === "accepted"
          ? "Apelación aceptada. Partido finalizado."
          : "Apelación rechazada.",
      );
      await loadMatch();
    } catch (error) {
      console.error("Error resolving appeal:", error);
      toast.error("No se pudo resolver la apelación.");
    } finally {
      setIsResolvingAppeal(false);
    }
  };

  const confirmButtonDisabled =
    isSubmittingConfirmation ||
    hasPendingAppeal ||
    match?.status === "finished" ||
    Boolean(ownConfirmation);

  const isFinalScoreAvailable = Boolean(
    match?.status === "finished" && match?.scoreBoard?.finalScore,
  );

  const displayedSetsCount = isFinalScoreAvailable
    ? match?.scoreBoard?.finalScore?.setsCount
    : setsCount;

  const displayedSets = isFinalScoreAvailable
    ? match?.scoreBoard?.finalScore?.sets
    : sets;

  return {
    match,
    players,
    isParticipant,
    isMatchOwner,
    confirmedCount,
    hasMismatch,
    appeal,
    hasPendingAppeal,
    setsCount: displayedSetsCount || 0,
    sets: displayedSets || [],
    appealReason,
    isSubmittingConfirmation,
    isSubmittingAppeal,
    isResolvingAppeal,
    onChangeSetsCount,
    onChangeSetScore,
    submitConfirmation,
    submitAppeal,
    resolveAppeal,
    confirmButtonDisabled,
    isFinalScoreAvailable,
    isLoading,
    hasError,
    ownConfirmation,
    setAppealReason,
    confirmations,
    participantIds,
    currentUserId,
    displayedSetsCount,
    displayedSets,
  };
};

export default useScoreEvents;
