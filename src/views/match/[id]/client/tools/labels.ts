import type { MatchCreatorSummary, MatchRecord } from "@/types/match";

export const getDateLabel = (match: MatchRecord) => {
  const sourceDate = match.scheduledAt || `${match.dateOfMatch}T${match.timeOfMatch}`;
  const parsedDate = new Date(sourceDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return `${match.dateOfMatch} ${match.timeOfMatch}`;
  }

  return parsedDate.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getTimeLabel = (match: MatchRecord) => {
  if (match.timeOfMatch?.trim().length > 0) {
    return `${match.timeOfMatch} (90 min)`;
  }

  return "Horario pendiente";
};

export const getPlayerName = (player?: MatchCreatorSummary) => {
  if (!player) {
    return "Libre";
  }

  const byNames = `${player.firstName || ""} ${player.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  return player.name || "Jugador";
};

export const getInitials = (player: MatchCreatorSummary) => {
  const name = getPlayerName(player);
  const chunks = name.split(/\s+/).filter(Boolean);

  if (chunks.length === 0) {
    return "JG";
  }

  return chunks
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join("");
};
