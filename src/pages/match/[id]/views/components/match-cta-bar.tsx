import * as ReactIf from "react-if";

const { Else, If, Then } = ReactIf;

import { Button } from "../../../../../components/ui/button";

interface MatchCtaBarProps {
  canJoin: boolean;
  isParticipant: boolean;
  isPrivate?: boolean;
}

const MatchCtaBar: React.FC<MatchCtaBarProps> = ({
  canJoin,
  isParticipant,
  isPrivate,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full p-5 bg-background border-t border-border z-10">
      <If condition={canJoin}>
        <Then>
          <Button type="button" size="lg" className="w-full text-lg h-12 rounded-2xl">
            Unirse al partido
          </Button>
        </Then>

        <Else>
          <Button
            type="button"
            size="lg"
            className="w-full text-lg h-12 rounded-2xl"
            variant="secondary"
            disabled
          >
            {isParticipant && "Ya estas en este partido"}
            {!isParticipant && isPrivate && "Este partido es privado"}
            {!isParticipant && !isPrivate && "Partido no disponible"}
          </Button>
        </Else>
      </If>
    </div>
  );
};

export default MatchCtaBar;
