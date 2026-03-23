import { Slider } from "@/components/ui/slider";

import BoxContainer from "../../../../../components/ui/container";
import { useNewMatchStore } from "../../../../../store/new-match";
import Text from "../../../../../components/ui/text";
import { rangeCeiling, rangeFloor } from "../contants";

const SkillRangeSection: React.FC = () => {
  const rangeMin = useNewMatchStore((state) => state.rangeMin);
  const rangeMax = useNewMatchStore((state) => state.rangeMax);
  const setSkillRange = useNewMatchStore((state) => state.setSkillRange);

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
        onValueChange={setSkillRange}
      />
    </BoxContainer>
  );
};

export default SkillRangeSection;
