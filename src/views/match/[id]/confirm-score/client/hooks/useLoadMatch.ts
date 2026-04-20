import { getMatchById } from "@/firebase/match";
import { useCallback, useEffect, useState } from "react";
import { buildEmptySets, DEFAULT_SETS_COUNT } from "../tools/sets";
import type { MatchRecord, MatchSetScore } from "@/types/match";
import { useAuthStore } from "@/store/auth";

interface UseLoadMatchResult {
  matchId?: string | null;
}

export const useLoadMatch = ({ matchId }: UseLoadMatchResult) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [setsCount, setSetsCount] = useState<number>(DEFAULT_SETS_COUNT);
  const [sets, setSets] = useState<MatchSetScore[]>(
    buildEmptySets(DEFAULT_SETS_COUNT),
  );
  const [appealReason, setAppealReason] = useState("");
  const [isSubmittingConfirmation, setIsSubmittingConfirmation] =
    useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [isResolvingAppeal, setIsResolvingAppeal] = useState(false);

  const currentUserId = String(currentUser?.uid || "").trim();

  const loadMatch = useCallback(async () => {
    if (!matchId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      const currentMatch = await getMatchById(matchId);
      setMatch(currentMatch);
    } catch (error) {
      console.error("Error loading match score data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  const ownConfirmation =
    currentUserId && match?.scoreBoard?.confirmations
      ? match.scoreBoard.confirmations[currentUserId]
      : undefined;

  useEffect(() => {
    if (!match || !currentUserId) {
      return;
    }

    const fallbackScore = ownConfirmation || match.scoreBoard?.finalScore;

    if (!fallbackScore) {
      return;
    }

    setSetsCount(fallbackScore.setsCount);
    setSets(
      Array.from({ length: fallbackScore.setsCount }, (_, index) => ({
        teamA: Number(fallbackScore.sets[index]?.teamA || 0),
        teamB: Number(fallbackScore.sets[index]?.teamB || 0),
      })),
    );
  }, [currentUserId, match, ownConfirmation]);

  return {
    match,
    isLoading,
    hasError,
    setsCount,
    setSetsCount,
    sets,
    setSets,
    appealReason,
    setAppealReason,
    isSubmittingConfirmation,
    setIsSubmittingConfirmation,
    isSubmittingAppeal,
    setIsSubmittingAppeal,
    isResolvingAppeal,
    setIsResolvingAppeal,
    ownConfirmation,
    loadMatch,
  };
};
