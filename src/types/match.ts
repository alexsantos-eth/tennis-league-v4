
export type PublicMatchSport = "Tenis" | "Padel" | "Pickleball";
export type PublicMatchType = "Doubles" | "Singles";
export type PublicMatchFormat = "Ranking" | "Friendly";
export type PublicMatchStatus = "open" | "reserved" | "disputed" | "finished";
export type MatchTeam = "A" | "B";
export type MatchPlayerPosition = 0 | 1;
export type MatchAppealStatus = "pending" | "accepted" | "rejected";

export interface MatchCreatorSummary {
  id: string;
  uid?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  gtr: number;
  team?: MatchTeam;
  position?: MatchPlayerPosition;
}

export interface MatchSkillRange {
  min: number;
  max: number;
}

export interface MatchSetScore {
  teamA: number;
  teamB: number;
}

export interface MatchScorePayload {
  setsCount: number;
  sets: MatchSetScore[];
}

export interface MatchScoreConfirmation extends MatchScorePayload {
  confirmedAt: string;
}

export interface MatchScoreAppeal {
  createdBy: string;
  reason: string;
  status: MatchAppealStatus;
  proposedScore: MatchScorePayload;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface MatchScoreBoard {
  confirmations?: Record<string, MatchScoreConfirmation>;
  finalScore?: MatchScorePayload;
  finalizedAt?: string;
  appeal?: MatchScoreAppeal;
}

export interface MatchRecord {
  id?: string;
  sport: PublicMatchSport;
  matchType: PublicMatchType;
  matchFormat: PublicMatchFormat;
  isReserved: boolean;
  isPrivate: boolean;
  comments: string;
  location: string;
  dateOfMatch: string;
  timeOfMatch: string;
  scheduledAt: string;
  skillRange: MatchSkillRange;
  createdBy: MatchCreatorSummary;
  invitedPlayers?: MatchCreatorSummary[];
  status: PublicMatchStatus;
  scoreBoard?: MatchScoreBoard;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatchInput {
  sport: PublicMatchSport;
  matchType: PublicMatchType;
  matchFormat: PublicMatchFormat;
  isReserved: boolean;
  isPrivate: boolean;
  comments: string;
  location: string;
  dateOfMatch: string;
  timeOfMatch: string;
  skillRange: MatchSkillRange;
  createdBy: MatchCreatorSummary;
  invitedPlayers?: MatchCreatorSummary[];
}

export interface SubmitMatchScoreInput {
  setsCount: number;
  sets: MatchSetScore[];
}

export interface CreateMatchScoreAppealInput {
  reason: string;
  proposedScore: SubmitMatchScoreInput;
}
