import { getDateKey, normalizeMatchDateKey } from "@/lib/dates";
import type { MatchRecord } from "@/types/match";

export interface GetFilteredMatchesParams {
  matches: MatchRecord[];
  selectedDate: Date;
}

export const getFilteredMatches = ({
  matches,
  selectedDate,
}: GetFilteredMatchesParams) => {
  const selectedDateKey = getDateKey(selectedDate);

  const filteredMatches = matches.filter((match) => {
    const scheduledAtDate = String(match.scheduledAt || "")
      .trim()
      .split("T")[0];
    const matchDateKey = /^\d{4}-\d{2}-\d{2}$/.test(scheduledAtDate)
      ? scheduledAtDate
      : normalizeMatchDateKey(match.dateOfMatch, selectedDate);

    const isPrivateAndNotFinished =
      match.isPrivate && match.status !== "finished";

    return matchDateKey === selectedDateKey && !isPrivateAndNotFinished;
  });

  return filteredMatches;
};
