import { Calendar, Edit2Icon, PlusIcon } from "lucide-react";

import { Button } from "../../../../../components/ui/button";
import BoxContainer from "../../../../../components/ui/container";
import Text from "../../../../../components/ui/text";
import MatchDetailsRow from "./match-details-row";

interface DateTimeSectionProps {
  matchDate: string;
  matchTime: string;
  onOpen: () => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  matchDate,
  matchTime,
  onOpen,
}) => {
  return (
    <BoxContainer>
      <MatchDetailsRow
        title="Fecha y hora"
        icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
      >
        {matchDate ? (
          <div className="flex items-center gap-2" onClick={onOpen}>
            <Text variant="body" className="text-foreground text-right">
              {matchDate} {matchTime && `- ${matchTime}`}
            </Text>
            <Button size="icon-sm" variant="ghost" type="button">
              <Edit2Icon />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="icon"
            className="rounded-full bg-muted text-foreground"
            onClick={onOpen}
          >
            <PlusIcon />
          </Button>
        )}
      </MatchDetailsRow>
    </BoxContainer>
  );
};

export default DateTimeSection;
