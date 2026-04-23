import BoxContainer from "@/components/ui/container";

import UpcomingMatchCard from "./upcoming-match-card";

import type { MatchRecord } from "@/types/match";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, HistoryIcon } from "lucide-react";

interface UpcomingMatchesSliderProps {
  matches: MatchRecord[];
  currentUserUid?: string;
}

const UpcomingMatchesSlider: React.FC<UpcomingMatchesSliderProps> = ({
  matches,
  currentUserUid,
}) => {
  return (
    <BoxContainer
      title={
        <div className="flex items-center justify-between">
          <Text
            variant="bodyXs"
            className="text-muted-foreground uppercase font-semibold"
          >
            Proximos partidos
          </Text>

          <a href="/match">
            <Button variant="link" size="lg" className="p-0 h-max-h min-h-0 h-max">
              <HistoryIcon />
              Ver todos
            </Button>
          </a>
        </div>
      }
      className="p-0 bg-transparent border-0 shadow-none"
    >
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
        {matches.map((match) => (
          <div
            key={match.id || `${match.createdAt}-${match.scheduledAt}`}
            className="min-w-50 max-w-90 shrink-0 snap-start md:min-w-50"
          >
            <UpcomingMatchCard
              match={match}
              currentUserUid={currentUserUid}
              showTitle={false}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </BoxContainer>
  );
};

export default UpcomingMatchesSlider;
