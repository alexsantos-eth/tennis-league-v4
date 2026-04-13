import { AlertCircle, ChevronRight, Lock, SlidersHorizontal, Users2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import { Switch as SwitchButton } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";

import { matchFormatLabels } from "../contants";
import MatchDetailsRow from "./match-details-row";

const MatchDetailsSection: React.FC = () => {
  const matchFormat = useNewMatchStore((state) => state.matchFormat);
  const isReserved = useNewMatchStore((state) => state.isReserved);
  const isPrivate = useNewMatchStore((state) => state.isPrivate);
  const openMatchFormatSheet = useNewMatchStore(
    (state) => state.openMatchFormatSheet,
  );
  const setIsReserved = useNewMatchStore((state) => state.setIsReserved);
  const setIsPrivate = useNewMatchStore((state) => state.setIsPrivate);
  const isCompetitive = matchFormat === "Ranking";

  return (
    <BoxContainer className="flex flex-col gap-4" title="Detalles de partido">
      <MatchDetailsRow
        title="Tipo"
        icon={<Users2 className="w-4 h-4 text-muted-foreground" />}
      >
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 py-1"
          onClick={openMatchFormatSheet}
        >
          <Text variant="body" className="text-primary font-medium">
            {matchFormatLabels[matchFormat]}
          </Text>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Button>
      </MatchDetailsRow>

      {isCompetitive && (
        <Alert>
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            En competitivo tu score (GTR) se vera afectado.
          </AlertDescription>
        </Alert>
      )}

      <MatchDetailsRow
        icon={<SlidersHorizontal className="w-4 h-4 text-muted-foreground" />}
        title="¿La cancha esta reservada?"
      >
        <SwitchButton
          size="lg"
          checked={isReserved}
          onClick={() => setIsReserved(!isReserved)}
        />
      </MatchDetailsRow>

      <MatchDetailsRow
        icon={<Lock className="w-4 h-4 text-muted-foreground" />}
        title="¿El partido es privado?"
      >
        <SwitchButton
          size="lg"
          checked={isPrivate}
          onClick={() => setIsPrivate(!isPrivate)}
        />
      </MatchDetailsRow>
    </BoxContainer>
  );
};

export default MatchDetailsSection;
