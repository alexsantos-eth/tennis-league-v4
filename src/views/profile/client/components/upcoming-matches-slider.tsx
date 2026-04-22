import BoxContainer from "@/components/ui/container";

import UpcomingMatchCard from "./upcoming-match-card";

import type { MatchRecord } from "@/types/match";

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
      title="Proximos partidos"
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
