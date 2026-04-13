import { Calendar, Edit2Icon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";

import InfoRow from "@/components/ui/info-row";

const DateTimeSection: React.FC = () => {
  const matchDate = useNewMatchStore((state) => state.matchDate);
  const matchTime = useNewMatchStore((state) => state.matchTime);
  const openDateSheet = useNewMatchStore((state) => state.openDateSheet);

  return (
    <BoxContainer>
      <InfoRow
        title="Fecha y hora"
        icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
      >
        {matchDate ? (
          <div className="flex items-center gap-2" onClick={openDateSheet}>
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
            onClick={openDateSheet}
          >
            <PlusIcon />
          </Button>
        )}
      </InfoRow>
    </BoxContainer>
  );
};

export default DateTimeSection;
