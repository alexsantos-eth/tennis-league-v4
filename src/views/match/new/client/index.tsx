import { useEffect } from "react";

import Stack from "@/components/ui/stack";
import { useAuthStore } from "@/store/auth";
import { useNewMatchStore } from "@/store/new-match";

import CommentsSection from "./components/comments-section";
import CreateMatchButton from "./components/create-match-button";
import DateSheet from "./components/date-sheet";
import DateTimeSection from "./components/date-time-section";
import LocationSection from "./components/location-section";
import LocationSheet from "./components/location-sheet";
import MatchDetailsSection from "./components/match-details-section";
import MatchFormatSheet from "./components/match-format-sheet";
import MatchTypeSection from "./components/match-type-section";
import SkillRangeSection from "./components/skill-range-section";
import SportTabs from "./components/sport-tabs";
import TeamsSection from "./components/teams-section";

const NewMatchPage: React.FC = () => {
  const handleSubmit = useNewMatchStore((state) => state.handleSubmit);
  const bootstrapCurrentUserPlayer = useNewMatchStore(
    (state) => state.bootstrapCurrentUserPlayer,
  );
  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);

  const isRanked = useNewMatchStore((state) => state.matchFormat === "Ranking");

  useEffect(() => {
    bootstrapCurrentUserPlayer();
  }, [currentUserUid]);

  return (
    <>
      <Stack className="w-full pb-30 overflow-scroll h-full no-scrollbar" noPx>
        <form onSubmit={handleSubmit}>
          <SportTabs />

          <Stack className="mt-6">
            <MatchTypeSection />

            <TeamsSection />

            <DateTimeSection />

            <LocationSection />

            <MatchDetailsSection />

            {isRanked && <SkillRangeSection />}

            <CommentsSection />

            <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t border-border z-10">
              <CreateMatchButton />
            </div>
          </Stack>
        </form>
      </Stack>

      <DateSheet />

      <LocationSheet />

      <MatchFormatSheet />
    </>
  );
};

export default NewMatchPage;
