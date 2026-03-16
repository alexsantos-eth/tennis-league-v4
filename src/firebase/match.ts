import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { CreateMatchInput, MatchRecord } from "../types/match";

const MATCH_COLLECTION = "match";

const buildScheduledAt = (dateOfMatch: string, timeOfMatch: string) =>
  `${dateOfMatch}T${timeOfMatch}`;

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
