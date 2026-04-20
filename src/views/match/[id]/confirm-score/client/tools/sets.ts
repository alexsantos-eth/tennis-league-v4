import type {
  MatchCreatorSummary,
  MatchSetScore,
  SubmitMatchScoreInput,
} from "@/types/match";

export const DEFAULT_SETS_COUNT = 3;

export const getPlayerId = (player: MatchCreatorSummary) =>
  String(player.uid || player.id || "").trim();

export const getPlayerName = (player?: MatchCreatorSummary) => {
  const byNames = `${player?.firstName || ""} ${player?.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  return player?.name || "Jugador";
};

export const clampSetsCount = (value: number) => {
  const nextValue = Number(value || DEFAULT_SETS_COUNT);

  if (!Number.isFinite(nextValue)) {
    return DEFAULT_SETS_COUNT;
  }

  return Math.min(5, Math.max(1, Math.trunc(nextValue)));
};

export const buildEmptySets = (setsCount: number): MatchSetScore[] =>
  Array.from({ length: clampSetsCount(setsCount) }, () => ({
    teamA: 0,
    teamB: 0,
  }));

export const buildScoreSignature = (scoreInput: SubmitMatchScoreInput) =>
  `${scoreInput.setsCount}:${scoreInput.sets
    .map((setScore) => `${setScore.teamA}-${setScore.teamB}`)
    .join("|")}`;

export const normalizeScoreInput = (
  setsCount: number,
  sets: MatchSetScore[],
): SubmitMatchScoreInput => {
  const normalizedSetsCount = clampSetsCount(setsCount);

  return {
    setsCount: normalizedSetsCount,
    sets: Array.from({ length: normalizedSetsCount }, (_, index) => {
      const currentSet = sets[index];

      return {
        teamA: Math.max(0, Math.trunc(Number(currentSet?.teamA || 0))),
        teamB: Math.max(0, Math.trunc(Number(currentSet?.teamB || 0))),
      };
    }),
  };
};
