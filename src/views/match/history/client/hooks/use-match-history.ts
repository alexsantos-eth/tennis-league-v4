import { useEffect, useState } from "react";

import { getAllMatches } from "@/firebase/match";
import { useAuthStore } from "@/store/auth";

import type { MatchRecord } from "@/types/match";

const isUserInMatch = (match: MatchRecord, uid: string) => {
  const isCreator = match.createdBy?.uid === uid || match.createdBy?.id === uid;
  const isInvited = (match.invitedPlayers || []).some(
    (player) => player.uid === uid || player.id === uid,
  );

  return isCreator || isInvited;
};

const useMatchHistory = () => {
  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMatchHistory = async () => {
      if (!currentUserUid) {
        setMatches([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        const allMatches = await getAllMatches();

        const nextMatches = allMatches.filter((match) =>
          isUserInMatch(match, currentUserUid),
        );

        if (!isMounted) {
          return;
        }

        setMatches(nextMatches);
      } catch (error) {
        console.error("Error loading match history:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMatchHistory();

    return () => {
      isMounted = false;
    };
  }, [currentUserUid]);

  return { matches, isLoading, hasError };
};

export default useMatchHistory;