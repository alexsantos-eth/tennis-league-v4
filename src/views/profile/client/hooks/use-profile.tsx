import { useEffect, useMemo, useState } from "react";

import { getRecentMatches } from "@/firebase/match";
import { getAllUsers } from "@/firebase/users";
import { normalizeMatchDateKey } from "@/lib/dates";
import { calculateRankingByUTR } from "@/lib/ranking";
import { useAuthStore } from "@/store/auth";

import type { MatchRecord } from "@/types/match";
import type { User } from "@/types/users";

interface ProfileStat {
  label: string;
  value: string;
}

const parseMatchDate = (match: MatchRecord): number => {
  const parseFlexibleDateTime = (rawDate: string, rawTime: string): number => {
    const normalizedDate = normalizeMatchDateKey(rawDate, new Date());
    const normalizedTime = (rawTime || "00:00").trim();
    const ts = Date.parse(`${normalizedDate}T${normalizedTime}`);

    return ts;
  };

  if (match.scheduledAt) {
    const [rawDate = "", rawTime = ""] = String(match.scheduledAt).split("T");
    const scheduledTs = parseFlexibleDateTime(rawDate, rawTime);

    if (!Number.isNaN(scheduledTs)) {
      return scheduledTs;
    }
  }

  const composedTs = parseFlexibleDateTime(match.dateOfMatch, match.timeOfMatch);

  if (!Number.isNaN(composedTs)) {
    return composedTs;
  }

  return Number.POSITIVE_INFINITY;
};

const isUserInMatch = (match: MatchRecord, uid: string) => {
  const isCreator = match.createdBy?.uid === uid || match.createdBy?.id === uid;
  const isInvited = (match.invitedPlayers || []).some(
    (player) => player.uid === uid || player.id === uid,
  );

  return isCreator || isInvited;
};

const buildStats = (user: User | null, users: User[], totalMatches: number): ProfileStat[] => {
  const userUtr = String(Number(user?.utr || 0));
  const ranking =
    users.length > 0
      ? calculateRankingByUTR(
          userUtr,
          users.map((entry) => ({ utr: String(Number(entry.utr || 0)) })),
        )
      : "-";

  return [
    { label: "Ranking", value: ranking },
    { label: "Partidos", value: String(totalMatches) },
    { label: "UTR", value: Number(user?.utr || 0).toFixed(2) },
  ];
};

const useProfile = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [upcomingMatch, setUpcomingMatch] = useState<MatchRecord | null>(null);
  const [stats, setStats] = useState<ProfileStat[]>([
    { label: "Ranking", value: "-" },
    { label: "Partidos", value: "0" },
    { label: "UTR", value: "0.00" },
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      if (!currentUser?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        const [recentMatches, users] = await Promise.all([
          getRecentMatches(100),
          getAllUsers(),
        ]);

        if (!isMounted) {
          return;
        }

        const userMatches = recentMatches.filter((match) =>
          isUserInMatch(match, currentUser.uid as string),
        );

        const nextMatch = userMatches
          .filter((match) => parseMatchDate(match) >= Date.now())
          .sort((a, b) => parseMatchDate(a) - parseMatchDate(b))[0];

        setUpcomingMatch(nextMatch || null);
        setStats(buildStats(currentUser, users, userMatches.length));
      } catch (error) {
        console.error("Error loading profile data:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  const fullName = useMemo(() => {
    const byNames = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();
    if (byNames.length > 0) {
      return byNames;
    }

    if ((currentUser?.name || "").trim().length > 0) {
      return String(currentUser?.name || "");
    }

    return "Jugador";
  }, [currentUser?.firstName, currentUser?.lastName, currentUser?.name]);

  return {
    user: currentUser,
    fullName,
    isLoading,
    hasError,
    stats,
    upcomingMatch,
  };
};

export default useProfile;
