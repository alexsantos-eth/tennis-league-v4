import { RotateCcwIcon } from "lucide-react";

import Text from "../../../../../components/ui/text";
import { Button } from "../../../../../components/ui/button";
import BoxContainer from "../../../../../components/ui/container";
import MatchTeamCol from "./match-team-col";
import { useNewMatchStore } from "../../../../../store/new-match";

const TeamsSection: React.FC = () => {
  const invitedPlayers = useNewMatchStore((state) => state.invitedPlayers);
  const resetInvitedPlayers = useNewMatchStore(
    (state) => state.resetInvitedPlayers,
  );
  const hasGuestInvites = invitedPlayers.length > 1;

  return (
    <BoxContainer className="py-6">
      <div className="grid grid-cols-[1fr_auto_1fr] justify-center items-center">
        <MatchTeamCol title="Equipo A" team="A" />
        <div className="w-full flex flex-col items-center pt-8">
          <div className="bg-primary h-9 w-9 flex items-center rounded-full justify-center">
            <Text variant="body" className="text-primary-foreground">vs</Text>
          </div>
        </div>
        <MatchTeamCol title="Equipo B" team="B" />
      </div>

      {hasGuestInvites && (
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={resetInvitedPlayers}
            className="rounded-2xl"
          >
            <RotateCcwIcon />
            Reiniciar jugadores
          </Button>
        </div>
      )}
    </BoxContainer>
  );
};

export default TeamsSection;
