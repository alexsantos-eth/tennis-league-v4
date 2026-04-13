import { CalendarDays, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

import type { MatchCreatorSummary, MatchRecord } from "@/types/match";

interface UpcomingMatchCardProps {
  match: MatchRecord;
  currentUserUid?: string;
}

const getDisplayName = (player?: MatchCreatorSummary) => {
  if (!player) {
    return "Oponente pendiente";
  }

  const byNames = `${player.firstName || ""} ${player.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  if ((player.name || "").trim().length > 0) {
    return player.name;
  }

  return "Jugador";
};

const getOpponent = (match: MatchRecord, uid?: string) => {
  const firstGuest = match.invitedPlayers?.[0];

  if (!uid) {
    return firstGuest || match.createdBy;
  }

  const isCurrentUserCreator =
    match.createdBy.uid === uid || match.createdBy.id === uid;

  if (isCurrentUserCreator) {
    return firstGuest;
  }

  return match.createdBy;
};

const getFormattedDate = (match: MatchRecord) => {
  const fallback = `${match.dateOfMatch} ${match.timeOfMatch}`;
  const dateToFormat = match.scheduledAt || `${match.dateOfMatch}T${match.timeOfMatch}`;
  const parsedDate = new Date(dateToFormat);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({
  match,
  currentUserUid,
}) => {
  const opponent = getOpponent(match, currentUserUid);

  return (
    <BoxContainer className="p-5 gap-4 flex flex-col shadow-sm" title="Proximo partido">
      <div className="flex flex-col gap-1">
        <Text variant="bodyLarge" className="text-primary font-bold uppercase tracking-wide">
          vs. {getDisplayName(opponent)}
        </Text>

        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <Text variant="body" className="text-muted-foreground">
            {getFormattedDate(match)}
          </Text>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          <Text variant="body" className="text-muted-foreground">
            {match.location}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="secondary" >
          <a href={`/match/${match.id}`}>Ver partido</a>
        </Button>

        <Button asChild >
          <a href={`/match/${match.id}`}>
            <MessageCircle />
            Contactar
          </a>
        </Button>
      </div>
    </BoxContainer>
  );
};

export default UpcomingMatchCard;
