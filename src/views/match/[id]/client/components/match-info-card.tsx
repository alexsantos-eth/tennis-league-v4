import { CalendarDays, Globe, MapPin } from "lucide-react";

import BoxContainer from "@/components/ui/container";
import InfoRow from "@/components/ui/info-row";

import { getDateLabel, getTimeLabel } from "../tools/labels";

import type { MatchRecord } from "@/types/match";
interface MatchInfoCardProps {
  match: MatchRecord;
}

const MatchInfoCard: React.FC<MatchInfoCardProps> = ({ match }) => {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`;

  return (
    <BoxContainer className="flex flex-col gap-4 -mt-12">
      <InfoRow
        icon={<CalendarDays className="size-4 text-muted-foreground" />}
        title={getDateLabel(match)}
        description={getTimeLabel(match)}
        className="border-b border-border pb-4"
      />

      <InfoRow
        icon={<MapPin className="size-4 text-muted-foreground" />}
        title={match.location}
        description="Ubicacion del partido"
        className="border-b border-border pb-4"
      >
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent p-2 mt-1"
        >
          <Globe className="size-4 text-muted-foreground" />
        </a>
      </InfoRow>

      <InfoRow
        icon={<Globe className="size-4 text-muted-foreground" />}
        title={match.isPrivate ? "Partido Privado" : "Partido Publico"}
        description={
          match.isPrivate
            ? "Solo por invitacion"
            : "Abierto a todos los niveles"
        }
      />
    </BoxContainer>
  );
};

export default MatchInfoCard;
