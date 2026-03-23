import CommentsSection from "./components/comments-section";
import CreateMatchButton from "./components/create-match-button";
import DateSheet from "./components/date-sheet";
import DateTimeSection from "./components/date-time-section";
import LocationSection from "./components/location-section";
import LocationSheet from "./components/location-sheet";
import MatchDetailsSection from "./components/match-details-section";
import MatchTypeSection from "./components/match-type-section";
import SkillRangeSection from "./components/skill-range-section";
import SportTabs from "./components/sport-tabs";
import TeamsSection from "./components/teams-section";
import { useNewMatch } from "./hooks/useNewMatch";

export default function NewMatchPage() {
  const {
    sport,
    setSport,
    matchType,
    setMatchType,
    matchFormat,
    setMatchFormat,
    isReserved,
    setIsReserved,
    isPrivate,
    setIsPrivate,
    comments,
    setComments,
    location,
    matchDate,
    matchTime,
    setMatchTime,
    rangeMin,
    rangeMax,
    isSubmitting,
    isDateSheetOpen,
    setIsDateSheetOpen,
    isLocationSheetOpen,
    setIsLocationSheetOpen,
    tempDate,
    setTempDate,
    tempLocation,
    setTempLocation,
    timeOptions,
    handleOpenDateSheet,
    handleConfirmDate,
    handleOpenLocationSheet,
    handleConfirmLocation,
    handleMinRangeChange,
    handleMaxRangeChange,
    handleSubmit,
  } = useNewMatch();

  return (
    <>
      <form
        className="w-full flex flex-col pb-8 gap-6 overflow-scroll h-full"
        onSubmit={handleSubmit}
      >
        <SportTabs sport={sport} onSportChange={setSport} />

        <div className="w-full flex flex-col gap-6 px-6">
          <MatchTypeSection
            matchType={matchType}
            onMatchTypeChange={setMatchType}
          />

          <TeamsSection />

          <DateTimeSection
            matchDate={matchDate}
            matchTime={matchTime}
            onOpen={handleOpenDateSheet}
          />

          <LocationSection location={location} onOpen={handleOpenLocationSheet} />

          <SkillRangeSection
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            onRangeChange={(values) => {
              const [min, max] = values;
              handleMinRangeChange(min);
              handleMaxRangeChange(max);
            }}
          />

          <MatchDetailsSection
            matchFormat={matchFormat}
            isReserved={isReserved}
            isPrivate={isPrivate}
            onMatchFormatChange={setMatchFormat}
            onReservedChange={setIsReserved}
            onPrivateChange={setIsPrivate}
          />

          <CommentsSection
            comments={comments}
            onCommentsChange={setComments}
          />

          <CreateMatchButton isSubmitting={isSubmitting} />
        </div>
      </form>

      <DateSheet
        open={isDateSheetOpen}
        selectedDate={tempDate}
        selectedTime={matchTime}
        timeOptions={timeOptions}
        onOpenChange={setIsDateSheetOpen}
        onDateChange={setTempDate}
        onTimeChange={setMatchTime}
        onConfirm={handleConfirmDate}
      />

      <LocationSheet
        open={isLocationSheetOpen}
        tempLocation={tempLocation}
        onOpenChange={setIsLocationSheetOpen}
        onTempLocationChange={setTempLocation}
        onConfirm={handleConfirmLocation}
      />
    </>
  );
}
