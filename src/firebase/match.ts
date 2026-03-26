import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeMatchDateKey } from "../lib/dates";
import type { CreateMatchInput, MatchRecord, MatchCreatorSummary } from "../types/match";

const MATCH_COLLECTION = "match";

const buildScheduledAt = (dateOfMatch: string, timeOfMatch: string) => {
  const normalizedDate = normalizeMatchDateKey(dateOfMatch, new Date());
  const normalizedTime = (timeOfMatch || "00:00").trim();

  return `${normalizedDate}T${normalizedTime}`;
};

export const createMatch = async (
  input: CreateMatchInput,
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

  const matchRef = await addDoc(collection(db, MATCH_COLLECTION), payload);

  return {
    id: matchRef.id,
    ...payload,
  };
};

export const getRecentMatches = async (
  maxResults = 10,
): Promise<MatchRecord[]> => {
  const matchesQuery = query(
    collection(db, MATCH_COLLECTION),
    orderBy("scheduledAt", "asc"),
    limit(maxResults),
  );

  const snapshot = await getDocs(matchesQuery);

  return snapshot.docs.map((matchDoc) => ({
    id: matchDoc.id,
    ...(matchDoc.data() as Omit<MatchRecord, "id">),
  }));
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
      (p) => (p.id === newPlayer.id || p.uid === newPlayer.uid) && p.id !== currentMatch.createdBy.id
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

