import { useEffect, useMemo, useState } from "react";

import { getMatchById } from "@/firebase/match";
import { useAuthStore } from "@/store/auth";

import type { MatchCreatorSummary, MatchRecord } from "@/types/match";

const getPlayersCapacity = (matchType?: MatchRecord["matchType"]) => {
  if (matchType === "Singles") {
    return 2;
  }

  return 4;
};

const isPlayerInMatch = (player: MatchCreatorSummary, uid?: string) => {
  if (!uid) {
    return false;
  }

  return player.uid === uid || player.id === uid;
};

const useMatchDetail = (matchId: string) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMatch = async () => {
      if (!matchId) {
        setIsLoading(false);
        setHasError(true);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        const nextMatch = await getMatchById(matchId);

        if (!isMounted) {
          return;
        }

        setMatch(nextMatch);
      } catch (error) {
        console.error("Error loading match detail:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMatch();

    return () => {
      isMounted = false;
    };
  }, [matchId]);

  const players = useMemo(() => {
    if (!match) {
      return [] as MatchCreatorSummary[];
    }

    return [match.createdBy, ...(match.invitedPlayers || [])];
  }, [match]);

  const playersCapacity = useMemo(() => getPlayersCapacity(match?.matchType), [match?.matchType]);

  const isCurrentUserParticipant = useMemo(() => {
    return players.some((player) => isPlayerInMatch(player, currentUser?.uid));
  }, [currentUser?.uid, players]);

  const isCurrentUserInvitedButNotConfirmed = useMemo(() => {
    if (!match || !currentUser?.uid) {
      return false;
    }

    const invitedPlayers = match.invitedPlayers || [];
    const invitedPlayer = invitedPlayers.find(
      (player) => player.uid === currentUser.uid || player.id === currentUser.uid,
    );

    return Boolean(invitedPlayer && !invitedPlayer.confirmed);
  }, [match, currentUser?.uid]);

  const canJoin = Boolean(
    match &&
      !isCurrentUserParticipant &&
      ((match.isPrivate && isCurrentUserInvitedButNotConfirmed) ||
        (!match.isPrivate && match.status === "open")),
  );

  return {
    match,
    isLoading,
    hasError,
    currentUser,
    players,
    playersCapacity,
    isCurrentUserParticipant,
    isCurrentUserInvitedButNotConfirmed,
    canJoin,
  };
};

export default useMatchDetail;
