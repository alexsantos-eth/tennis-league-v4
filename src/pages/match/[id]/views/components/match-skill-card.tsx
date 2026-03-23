import BoxContainer from "../../../../../components/ui/container";
import Text from "../../../../../components/ui/text";

import type { MatchRecord } from "../../../../../types/match";

interface MatchSkillCardProps {
  match: MatchRecord;
}

const MatchSkillCard: React.FC<MatchSkillCardProps> = ({ match }) => {
  const min = Number(match.skillRange?.min || 0);
  const max = Number(match.skillRange?.max || 0);
  const center = (min + max) / 2;
  const fillPercent = Math.min(Math.max((center / 8) * 100, 10), 100);

  return (
    <BoxContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Text variant="h4">Nivel requerido</Text>
        <Text variant="bodySmall" className="text-primary font-semibold">
          Competitivo
        </Text>
      </div>

      <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
        <div className="h-full rounded-full bg-primary" style={{ width: `${fillPercent}%` }} />
      </div>

      <div className="w-full flex items-center justify-between">
        <Text variant="body" className="text-muted-foreground">
          Principiante
        </Text>

        <Text variant="body" className="font-semibold text-foreground">
          {min.toFixed(1)} - {max.toFixed(1)}
        </Text>

        <Text variant="body" className="text-muted-foreground">
          Pro
        </Text>
      </div>
    </BoxContainer>
  );
};

export default MatchSkillCard;
