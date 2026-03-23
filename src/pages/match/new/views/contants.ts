import type {
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../../../../types/match";

export const sports: PublicMatchSport[] = ["Tenis", "Padel", "Pickleball"];
export const matchTypes: PublicMatchType[] = ["Doubles", "Singles"];
export const matchFormats: PublicMatchFormat[] = ["Ranking", "Friendly"];

export const matchFormatLabels: Record<PublicMatchFormat, string> = {
  Ranking: "Competitivo",
  Friendly: "Amistoso",
};

export const popularClubs = [
  "Federacion z15",
  "Club Delfines",
  "Camino Real",
  "Sporta",
];

export const rangeFloor = 0;
export const rangeCeiling = 10;
export const rangeStep = 1;
