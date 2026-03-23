import Text from "../../../../../components/ui/text";
import BoxContainer from "../../../../../components/ui/container";
import MatchTeamCol from "./match-team-col";

const TeamsSection: React.FC = () => {
  return (
    <BoxContainer className="grid grid-cols-[1fr_auto_1fr] justify-center items-center py-6">
      <MatchTeamCol title="Equipo A" />
      <div className="w-full flex flex-col items-center pt-8">
        <div className="bg-primary h-9 w-9 flex items-center rounded-full justify-center">
          <Text variant="body">vs</Text>
        </div>
      </div>
      <MatchTeamCol title="Equipo B" />
    </BoxContainer>
  );
};

export default TeamsSection;
