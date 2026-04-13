import { getDateKey, normalizeMatchDateKey } from "@/lib/dates";
import type { MatchRecord } from "@/types/match";

export interface GetFilteredMatchesParams {
  matches: MatchRecord[];
  selectedDate: Date;
  currentUserId?: string;
}

export const getFilteredMatches = ({
  matches,
  selectedDate,
  currentUserId,
}: GetFilteredMatchesParams) => {
  const selectedDateKey = getDateKey(selectedDate);

  const filteredMatches = matches.filter((match) => {
    const scheduledAtDate = String(match.scheduledAt || "")
      .trim()
      .split("T")[0];
    const matchDateKey = /^\d{4}-\d{2}-\d{2}$/.test(scheduledAtDate)
      ? scheduledAtDate
      : normalizeMatchDateKey(match.dateOfMatch, selectedDate);

    const isCurrentUserInMatch =
      Boolean(currentUserId) &&
      (match.createdBy.uid === currentUserId ||
        match.createdBy.id === currentUserId ||
        (match.invitedPlayers || []).some(
          (player) =>
            player.uid === currentUserId || player.id === currentUserId,
        ));

    const isPrivateAndNotFinishedForNonParticipant =
      match.isPrivate && match.status !== "finished" && !isCurrentUserInMatch;

    return (
      matchDateKey === selectedDateKey &&
      !isPrivateAndNotFinishedForNonParticipant
    );
  });

  return filteredMatches;
};
