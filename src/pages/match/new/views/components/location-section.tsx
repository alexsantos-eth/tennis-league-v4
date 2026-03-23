import { Edit2Icon, MapPin, PlusIcon } from "lucide-react";

import { Button } from "../../../../../components/ui/button";
import BoxContainer from "../../../../../components/ui/container";
import { useNewMatchStore } from "../../../../../store/new-match";
import Text from "../../../../../components/ui/text";
import MatchDetailsRow from "./match-details-row";

const LocationSection: React.FC = () => {
  const location = useNewMatchStore((state) => state.location);
  const openLocationSheet = useNewMatchStore((state) => state.openLocationSheet);

  return (
    <BoxContainer className="flex flex-col gap-4">
      <MatchDetailsRow
        title="Ubicacion"
        icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
      >
        {location ? (
          <div className="flex items-center gap-2" onClick={openLocationSheet}>
            <Text variant="body" className="text-foreground text-right">
              {location}
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
            onClick={openLocationSheet}
          >
            <PlusIcon />
          </Button>
        )}
      </MatchDetailsRow>
    </BoxContainer>
  );
};

export default LocationSection;
