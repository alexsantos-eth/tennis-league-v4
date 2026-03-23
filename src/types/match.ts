
export type PublicMatchSport = "Tenis" | "Padel" | "Pickleball";
export type PublicMatchType = "Doubles" | "Singles";
export type PublicMatchFormat = "Ranking" | "Friendly";
export type PublicMatchStatus = "open" | "reserved";

export interface MatchCreatorSummary {
  id: string;
  uid?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  gtr: number;
}

export interface MatchSkillRange {
  min: number;
  max: number;
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
  status: PublicMatchStatus;
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
}
