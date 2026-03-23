import { useEffect } from 'react';

import { useNewMatchStore } from '../../../../store/new-match';
import { useAuthStore } from '../../../../store/auth';
import CommentsSection from './components/comments-section';
import CreateMatchButton from './components/create-match-button';
import DateSheet from './components/date-sheet';
import DateTimeSection from './components/date-time-section';
import LocationSection from './components/location-section';
import LocationSheet from './components/location-sheet';
import MatchDetailsSection from './components/match-details-section';
import MatchTypeSection from './components/match-type-section';
import SkillRangeSection from './components/skill-range-section';
import SportTabs from './components/sport-tabs';
import TeamsSection from './components/teams-section';

const NewMatchPage:React.FC = () => {
  const handleSubmit = useNewMatchStore((state) => state.handleSubmit);
  const bootstrapCurrentUserPlayer = useNewMatchStore((state) => state.bootstrapCurrentUserPlayer);
  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);

  useEffect(() => {
    bootstrapCurrentUserPlayer();
  }, [bootstrapCurrentUserPlayer, currentUserUid]);

  return (
    <>
      <form
        className="w-full flex flex-col pb-8 gap-6 overflow-scroll h-full"
        onSubmit={handleSubmit}
      >
        <SportTabs />

        <div className="w-full flex flex-col gap-6 px-6">
          <MatchTypeSection />

          <TeamsSection />

          <DateTimeSection />

          <LocationSection />

          <SkillRangeSection />

          <MatchDetailsSection />

          <CommentsSection />

          <CreateMatchButton />
        </div>
      </form>

      <DateSheet />

      <LocationSheet />
    </>
  );
}

export default NewMatchPage;
