import { Slider } from "@/components/ui/slider";

import BoxContainer from "../../../../../components/ui/container";
import Text from "../../../../../components/ui/text";
import { rangeCeiling, rangeFloor } from "../contants";

interface SkillRangeSectionProps {
  rangeMin: number;
  rangeMax: number;
  onRangeChange: (values: number[]) => void;
}

const SkillRangeSection: React.FC<SkillRangeSectionProps> = ({
  rangeMin,
  rangeMax,
  onRangeChange,
}) => {
  return (
    <BoxContainer className="flex flex-col gap-5" title="Rango permitido">
      <div className="flex items-center justify-between">
        <Text variant="body" className="text-foreground font-medium">
          GTR
        </Text>
        <Text variant="body" className="text-primary font-semibold">
          {rangeMin} - {rangeMax}
        </Text>
      </div>

      <Slider
        value={[rangeMin, rangeMax]}
        max={rangeCeiling}
        min={rangeFloor}
        step={1}
        onValueChange={onRangeChange}
      />
    </BoxContainer>
  );
};

export default SkillRangeSection;
