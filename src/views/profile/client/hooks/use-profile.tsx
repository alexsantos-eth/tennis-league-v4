import { useEffect, useMemo, useState } from "react";

import { getRecentMatches } from "@/firebase/match";
import { getUser } from "@/firebase/users";
import { normalizeMatchDateKey } from "@/lib/dates";
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

  const composedTs = parseFlexibleDateTime(
    match.dateOfMatch,
    match.timeOfMatch,
  );

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

const buildStats = (user: User | null, totalMatches: number): ProfileStat[] => {
  const userUtr = String(Number(user?.utr || 0));
  const category = user?.category;

  return [
    { label: "Categoria", value: category || "-" },
    { label: "Partidos", value: String(totalMatches) },
    { label: "UTR", value: Number(user?.utr || 0).toFixed(2) },
  ];
};

const useProfile = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchRecord[]>([]);
  const [stats, setStats] = useState<ProfileStat[]>([
    { label: "Ranking", value: "-" },
    { label: "Partidos", value: "0" },
    { label: "UTR", value: "0.00" },
  ]);

  const [userMatches, setUserMatches] = useState<MatchRecord[]>([]);

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

        const [recentMatches, profileUser] = await Promise.all([
          getRecentMatches(100),
          getUser(currentUser.uid as string),
        ]);

        if (!isMounted) {
          return;
        }

        const userMatches = recentMatches.filter((match) =>
          isUserInMatch(match, currentUser.uid as string),
        );

        setUserMatches(userMatches);

        const nextMatches = userMatches
          .filter((match) => parseMatchDate(match) >= Date.now())
          .sort((a, b) => parseMatchDate(a) - parseMatchDate(b));

        setUpcomingMatches(nextMatches);
        setStats(
          buildStats((profileUser as User) || currentUser, userMatches.length),
        );
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
    const byNames =
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();
    if (byNames.length > 0) {
      return byNames;
    }

    if ((currentUser?.name || "").trim().length > 0) {
      return String(currentUser?.name || "");
    }

    return "Jugador";
  }, [currentUser?.firstName, currentUser?.lastName, currentUser?.name]);

  const friendlyMatches = useMemo(() => {
    return userMatches.filter((match) => match.matchFormat === "Friendly");
  }, [userMatches]);

  const rankingMatches = useMemo(() => {
    return userMatches.filter((match) => match.matchFormat === "Ranking");
  }, [userMatches]);

  return {
    user: currentUser,
    fullName,
    isLoading,
    userMatches,
    hasError,
    stats,
    upcomingMatches,
    friendlyMatches,
    rankingMatches,
  };
};

export default useProfile;
