import { useEffect, useState } from "react";
import type { MatchRecord } from "../../../types/match";
import { getRecentMatches } from "../../../firebase/match";
import { getDateKey, normalizeMatchDateKey } from "@/lib/dates";

const getEffectiveMatchDateKey = (match: MatchRecord) => {
  const scheduledAtDate = String(match.scheduledAt || "").trim().split("T")[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(scheduledAtDate)) {
    return scheduledAtDate;
  }

  return normalizeMatchDateKey(match.dateOfMatch, new Date());
};

const useMatches = () => {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const nextMatches = await getRecentMatches(50);

        if (!isMounted) {
          return;
        }

        setMatches(nextMatches);

        const todayDateKey = getDateKey(new Date());
        const hasMatchForToday = nextMatches.some(
          (match) => getEffectiveMatchDateKey(match) === todayDateKey,
        );

        if (!hasMatchForToday && nextMatches.length > 0) {
          const firstAvailableDateKey = getEffectiveMatchDateKey(nextMatches[0]);
          const firstScheduledDate = new Date(`${firstAvailableDateKey}T00:00:00`);

          if (!Number.isNaN(firstScheduledDate.getTime())) {
            setSelectedDate(firstScheduledDate);
          }
        }
      } catch (error) {
        console.error("Error loading created matches:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  return { matches, selectedDate, setSelectedDate, isLoading, hasError };
};

export default useMatches;
