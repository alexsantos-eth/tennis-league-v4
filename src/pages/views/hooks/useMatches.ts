import { useEffect, useState } from "react";
import type { MatchRecord } from "../../../types/match";
import { getRecentMatches } from "../../../firebase/match";

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
        const nextMatches = await getRecentMatches();

        if (!isMounted) {
          return;
        }

        setMatches(nextMatches);
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
