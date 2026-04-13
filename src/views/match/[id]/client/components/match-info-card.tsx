import { CalendarDays, Globe, MapPin } from "lucide-react";

import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

import type { MatchRecord } from "@/types/match";

interface MatchInfoCardProps {
  match: MatchRecord;
}

const getDateLabel = (match: MatchRecord) => {
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

const getTimeLabel = (match: MatchRecord) => {
  if (match.timeOfMatch?.trim().length > 0) {
    return `${match.timeOfMatch} (90 min)`;
  }

  return "Horario pendiente";
};

const MatchInfoCard: React.FC<MatchInfoCardProps> = ({ match }) => {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`;

  return (
    <BoxContainer className="flex flex-col gap-4 -mt-12">
      <Text variant="h4" className="text-foreground">
        Información
      </Text>

      <div className="flex items-center gap-4">
        <div className="rounded-full bg-accent p-2.5 mt-1">
          <CalendarDays className="size-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col">
          <Text variant="body" className="font-semibold text-foreground">
            {getDateLabel(match)}
          </Text>
          <Text variant="bodySmall" className="text-muted-foreground">
            {getTimeLabel(match)}
          </Text>
        </div>
      </div>

      <div className="w-full border-t border-border" />

      <div className="flex items-center gap-4">
        <div className="rounded-full bg-accent p-2.5 mt-1">
          <MapPin className="size-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col flex-1">
          <Text variant="body" className="font-semibold text-foreground">
            {match.location}
          </Text>
          <Text variant="bodySmall" className="text-muted-foreground">
            Ubicacion del partido
          </Text>
        </div>

        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent p-2.5 mt-1"
        >
          <Globe className="size-4 text-muted-foreground" />
        </a>
      </div>

      <div className="w-full border-t border-border" />

      <div className="flex items-center gap-4">
        <div className="rounded-full bg-accent p-2.5 mt-1">
          <Globe className="size-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col">
          <Text variant="body" className="font-semibold text-foreground">
            {match.isPrivate ? "Partido Privado" : "Partido Publico"}
          </Text>

          {match.isPrivate && (
            <Text variant="bodySmall" className="text-muted-foreground">
              Solo por invitacion
            </Text>
          )}

          {!match.isPrivate && (
            <Text variant="bodySmall" className="text-muted-foreground">
              Abierto a todos los niveles
            </Text>
          )}
        </div>
      </div>
    </BoxContainer>
  );
};

export default MatchInfoCard;
