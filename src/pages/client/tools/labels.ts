import type { MatchRecord } from "@/types/match";

const getStatusLabel = (match: MatchRecord) => {
  switch (match.status) {
    case "reserved":
      return "Reservado";
    case "disputed":
      return "En apelacion";
    case "finished":
      return "Finalizado";
    default:
      return "Abierto";
  }
};


export default getStatusLabel;
