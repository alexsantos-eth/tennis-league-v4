import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeMatchDateKey } from "../lib/dates";
import { updatePlayersUTRAfterMatch } from "./utr";
import type {
  CreateMatchInput,
  CreateMatchScoreAppealInput,
  MatchCreatorSummary,
  MatchRecord,
  MatchScorePayload,
  SubmitMatchScoreInput,
} from "../types/match";

const MATCH_COLLECTION = "match";

const clampSetsCount = (setsCount: number) => {
  const nextValue = Number(setsCount || 3);

  if (!Number.isFinite(nextValue)) {
    return 3;
  }

  return Math.min(5, Math.max(1, Math.trunc(nextValue)));
};

const sanitizeSetValue = (value: number) => {
  const numericValue = Number(value || 0);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.trunc(numericValue));
};

const normalizeScoreInput = (
  scoreInput: SubmitMatchScoreInput,
): MatchScorePayload => {
  const setsCount = clampSetsCount(scoreInput.setsCount);
  const inputSets = Array.isArray(scoreInput.sets) ? scoreInput.sets : [];

  return {
    setsCount,
    sets: Array.from({ length: setsCount }, (_, index) => {
      const currentSet = inputSets[index];

      return {
        teamA: sanitizeSetValue(currentSet?.teamA ?? 0),
        teamB: sanitizeSetValue(currentSet?.teamB ?? 0),
      };
    }),
  };
};

const getScoreSignature = (scorePayload: MatchScorePayload) =>
  `${scorePayload.setsCount}:${scorePayload.sets
    .map((setScore) => `${setScore.teamA}-${setScore.teamB}`)
    .join("|")}`;

const getPlayerIdentifier = (player: MatchCreatorSummary) =>
  String(player.uid || player.id || "").trim();

const getMatchParticipants = (match: Omit<MatchRecord, "id">) => {
  const participants = [match.createdBy, ...(match.invitedPlayers || [])]
    .map(getPlayerIdentifier)
    .filter(Boolean);

  return Array.from(new Set(participants));
};

const buildScheduledAt = (dateOfMatch: string, timeOfMatch: string) => {
  const normalizedDate = normalizeMatchDateKey(dateOfMatch, new Date());
  const normalizedTime = (timeOfMatch || "00:00").trim();

  return `${normalizedDate}T${normalizedTime}`;
};

const getEffectiveScheduledAt = (match: Omit<MatchRecord, "id">) => {
  const rawScheduledAt = String(match.scheduledAt || "").trim();

  if (/^\d{4}-\d{2}-\d{2}T/.test(rawScheduledAt)) {
    return rawScheduledAt;
  }

  return buildScheduledAt(match.dateOfMatch, match.timeOfMatch);
};

const getSortedMatches = async (): Promise<MatchRecord[]> => {
  const matchesQuery = query(collection(db, MATCH_COLLECTION));

  const snapshot = await getDocs(matchesQuery);

  return snapshot.docs
    .map((matchDoc) => ({
      id: matchDoc.id,
      ...(matchDoc.data() as Omit<MatchRecord, "id">),
    }))
    .sort((a, b) => {
      const aDate = new Date(getEffectiveScheduledAt(a)).getTime();
      const bDate = new Date(getEffectiveScheduledAt(b)).getTime();

      return bDate - aDate;
    });
};

export const createMatchDoc = async (): Promise<
  DocumentReference<DocumentData, DocumentData>
> => {
  const matchRef = doc(collection(db, MATCH_COLLECTION));
  return matchRef;
};

export const createMatch = async (
  input: CreateMatchInput,
  docRef?: DocumentReference<DocumentData>,
): Promise<MatchRecord> => {
  const now = new Date().toISOString();

  const payload: Omit<MatchRecord, "id"> = {
    ...input,
    comments: input.comments.trim(),
    location: input.location.trim(),
    scheduledAt: buildScheduledAt(input.dateOfMatch, input.timeOfMatch),
    status: input.isReserved ? "reserved" : "open",
    createdAt: now,
    updatedAt: now,
  };

  const matchDoc: DocumentReference<DocumentData, DocumentData> =
    docRef ?? doc(collection(db, MATCH_COLLECTION));

  await setDoc(matchDoc, payload);

  return {
    id: matchDoc.id,
    ...payload,
  };
};

export const getRecentMatches = async (
  maxResults = 10,
): Promise<MatchRecord[]> => {
  const allMatches = await getSortedMatches();

  return allMatches.slice(0, maxResults);
};

export const getAllMatches = async (): Promise<MatchRecord[]> => {
  return getSortedMatches();
};

export const getMatchById = async (
  matchId: string,
): Promise<MatchRecord | null> => {
  const matchDoc = await getDoc(doc(db, MATCH_COLLECTION, matchId));

  if (!matchDoc.exists()) return null;

  return {
    id: matchDoc.id,
    ...(matchDoc.data() as Omit<MatchRecord, "id">),
  };
};

export const updateMatchPlayers = async (
  matchId: string,
  newPlayers: MatchCreatorSummary[],
): Promise<void> => {
  const matchRef = doc(db, MATCH_COLLECTION, matchId);
  const matchDoc = await getDoc(matchRef);

  if (!matchDoc.exists()) {
    throw new Error("Match not found");
  }

  const currentMatch = matchDoc.data() as Omit<MatchRecord, "id">;
  const existingPlayers = currentMatch.invitedPlayers || [];

  // Merge new players with existing ones, avoiding duplicates
  const allPlayers = [...existingPlayers];
  for (const newPlayer of newPlayers) {
    const playerExists = allPlayers.some(
      (p) =>
        (p.id === newPlayer.id || p.uid === newPlayer.uid) &&
        p.id !== currentMatch.createdBy.id,
    );
    if (!playerExists) {
      allPlayers.push(newPlayer);
    }
  }

  await updateDoc(matchRef, {
    invitedPlayers: allPlayers,
    updatedAt: new Date().toISOString(),
  });
};

export const submitMatchScoreConfirmation = async (
  matchId: string,
  participantId: string,
  scoreInput: SubmitMatchScoreInput,
): Promise<boolean> => {
  const participant = String(participantId || "").trim();

  if (!participant) {
    throw new Error("Participant id is required");
  }

  const matchRef = doc(db, MATCH_COLLECTION, matchId);

  let isUnanimous = false;
  let finalizedMatch: MatchRecord | undefined;

  await runTransaction(db, async (transaction) => {
    const matchDoc = await transaction.get(matchRef);

    if (!matchDoc.exists()) {
      throw new Error("Match not found");
    }

    const currentMatch = matchDoc.data() as Omit<MatchRecord, "id">;

    if (currentMatch.status === "finished") {
      throw new Error("This match is already finished");
    }

    const participants = getMatchParticipants(currentMatch);

    if (!participants.includes(participant)) {
      throw new Error("Only participants can confirm scores");
    }

    const now = new Date().toISOString();
    const normalizedScore = normalizeScoreInput(scoreInput);
    const currentScoreBoard = currentMatch.scoreBoard || {};
    const currentConfirmations = currentScoreBoard.confirmations || {};
    const nextConfirmations = {
      ...currentConfirmations,
      [participant]: {
        ...normalizedScore,
        confirmedAt: now,
      },
    };

    const confirmedParticipants = participants.filter((id) =>
      Boolean(nextConfirmations[id]),
    );
    const uniqueSignatures = Array.from(
      new Set(
        confirmedParticipants.map((id) =>
          getScoreSignature({
            setsCount: nextConfirmations[id].setsCount,
            sets: nextConfirmations[id].sets,
          }),
        ),
      ),
    );

    isUnanimous =
      confirmedParticipants.length === participants.length &&
      uniqueSignatures.length === 1;

    const nextScoreBoard = {
      ...currentScoreBoard,
      confirmations: nextConfirmations,
    };

    const payload: Partial<MatchRecord> = {
      scoreBoard: nextScoreBoard,
      updatedAt: now,
    };

    if (isUnanimous) {
      const firstParticipantId = participants[0];
      const firstConfirmation = nextConfirmations[firstParticipantId];

      nextScoreBoard.finalScore = {
        setsCount: firstConfirmation.setsCount,
        sets: firstConfirmation.sets,
      };
      nextScoreBoard.finalizedAt = now;
      payload.status = "finished";

      // Capture the finalized match for UTR calculation
      finalizedMatch = {
        id: matchId,
        ...currentMatch,
        scoreBoard: nextScoreBoard,
        status: "finished",
      } as MatchRecord;
    }

    transaction.update(matchRef, payload as Record<string, unknown>);
  });

  // After transaction completes, calculate UTR if match was finalized
  if (isUnanimous && finalizedMatch) {
    try {
      const playerAIds = (finalizedMatch.invitedPlayers || [])
        .filter((p): p is MatchCreatorSummary & { team: "A" } => p.team === "A")
        .map((p) => p.uid || p.id)
        .filter((id): id is string => Boolean(id));

      const playerBIds = (finalizedMatch.invitedPlayers || [])
        .filter((p): p is MatchCreatorSummary & { team: "B" } => p.team === "B")
        .map((p) => p.uid || p.id)
        .filter((id): id is string => Boolean(id));

      await updatePlayersUTRAfterMatch(finalizedMatch, playerAIds, playerBIds);
    } catch (error) {
      console.error("Error updating player UTR:", error);
      // Don't throw - UTR calculation is secondary to match finalization
    }
  }

  return isUnanimous;
};

export const createMatchScoreAppeal = async (
  matchId: string,
  participantId: string,
  appealInput: CreateMatchScoreAppealInput,
): Promise<void> => {
  const participant = String(participantId || "").trim();
  const appealReason = String(appealInput.reason || "").trim();

  if (!participant) {
    throw new Error("Participant id is required");
  }

  if (!appealReason) {
    throw new Error("Appeal reason is required");
  }

  const matchRef = doc(db, MATCH_COLLECTION, matchId);

  await runTransaction(db, async (transaction) => {
    const matchDoc = await transaction.get(matchRef);

    if (!matchDoc.exists()) {
      throw new Error("Match not found");
    }

    const currentMatch = matchDoc.data() as Omit<MatchRecord, "id">;

    if (currentMatch.status === "finished") {
      throw new Error("This match is already finished");
    }

    const participants = getMatchParticipants(currentMatch);

    if (!participants.includes(participant)) {
      throw new Error("Only participants can create an appeal");
    }

    const currentScoreBoard = currentMatch.scoreBoard || {};

    if (currentScoreBoard.appeal) {
      throw new Error("Only one appeal is allowed per match");
    }

    const now = new Date().toISOString();
    const normalizedScore = normalizeScoreInput(appealInput.proposedScore);

    const nextScoreBoard = {
      ...currentScoreBoard,
      appeal: {
        createdBy: participant,
        reason: appealReason,
        status: "pending" as const,
        proposedScore: normalizedScore,
        createdAt: now,
      },
    };

    transaction.update(matchRef, {
      status: "disputed",
      scoreBoard: nextScoreBoard,
      updatedAt: now,
    });
  });
};

export const resolveMatchScoreAppeal = async (
  matchId: string,
  resolverId: string,
  decision: "accepted" | "rejected",
): Promise<void> => {
  const resolver = String(resolverId || "").trim();

  if (!resolver) {
    throw new Error("Resolver id is required");
  }

  const matchRef = doc(db, MATCH_COLLECTION, matchId);

  await runTransaction(db, async (transaction) => {
    const matchDoc = await transaction.get(matchRef);

    if (!matchDoc.exists()) {
      throw new Error("Match not found");
    }

    const currentMatch = matchDoc.data() as Omit<MatchRecord, "id">;
    const ownerId = getPlayerIdentifier(currentMatch.createdBy);

    if (resolver !== ownerId) {
      throw new Error("Only match owner can resolve the appeal");
    }

    const currentScoreBoard = currentMatch.scoreBoard || {};
    const currentAppeal = currentScoreBoard.appeal;

    if (!currentAppeal) {
      throw new Error("No appeal found for this match");
    }

    if (currentAppeal.status !== "pending") {
      throw new Error("Appeal is already resolved");
    }

    const now = new Date().toISOString();
    const updatedAppeal = {
      ...currentAppeal,
      status: decision,
      resolvedAt: now,
      resolvedBy: resolver,
    };

    const nextScoreBoard = {
      ...currentScoreBoard,
      appeal: updatedAppeal,
    };

    const payload: Partial<MatchRecord> = {
      scoreBoard: nextScoreBoard,
      updatedAt: now,
    };

    if (decision === "accepted") {
      nextScoreBoard.finalScore = currentAppeal.proposedScore;
      nextScoreBoard.finalizedAt = now;
      payload.status = "finished";
    } else {
      payload.status = currentMatch.isReserved ? "reserved" : "open";
    }

    transaction.update(matchRef, payload as Record<string, unknown>);
  });
};

export const confirmParticipant = async (
  matchId: string,
  participantId: string,
): Promise<void> => {
  const participantIdentifier = String(participantId || "").trim();

  if (!participantIdentifier) {
    throw new Error("Participant id is required");
  }

  const matchRef = doc(db, MATCH_COLLECTION, matchId);
  const matchDoc = await getDoc(matchRef);

  if (!matchDoc.exists()) {
    throw new Error("Match not found");
  }

  const currentMatch = matchDoc.data() as Omit<MatchRecord, "id">;
  const invitedPlayers = currentMatch.invitedPlayers || [];

  const playerIndex = invitedPlayers.findIndex((p) => {
    const pId = p.uid || p.id;
    return pId === participantIdentifier;
  });

  if (playerIndex === -1) {
    throw new Error("Participant not found in invited players");
  }

  const updatedInvitedPlayers = [...invitedPlayers];
  updatedInvitedPlayers[playerIndex] = {
    ...updatedInvitedPlayers[playerIndex],
    confirmed: true,
  };

  await updateDoc(matchRef, {
    invitedPlayers: updatedInvitedPlayers,
    updatedAt: new Date().toISOString(),
  });
};
