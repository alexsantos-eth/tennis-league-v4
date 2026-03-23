import { Lock, SlidersHorizontal, Users2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch as SwitchButton } from "@/components/ui/switch";

import BoxContainer from "../../../../../components/ui/container";
import type { PublicMatchFormat } from "../../../../../types/match";
import { matchFormatLabels, matchFormats } from "../contants";
import MatchDetailsRow from "./match-details-row";

interface MatchDetailsSectionProps {
  matchFormat: PublicMatchFormat;
  isReserved: boolean;
  isPrivate: boolean;
  onMatchFormatChange: (value: PublicMatchFormat) => void;
  onReservedChange: (value: boolean) => void;
  onPrivateChange: (value: boolean) => void;
}

const MatchDetailsSection: React.FC<MatchDetailsSectionProps> = ({
  matchFormat,
  isReserved,
  isPrivate,
  onMatchFormatChange,
  onReservedChange,
  onPrivateChange,
}) => {
  return (
    <BoxContainer className="flex flex-col gap-4" title="Detalles de partido">
      <MatchDetailsRow
        title="Tipo"
        icon={<Users2 className="w-4 h-4 text-muted-foreground" />}
      >
        <Select
          value={matchFormat}
          onValueChange={(value) => onMatchFormatChange(value as PublicMatchFormat)}
        >
          <SelectTrigger className="text-primary font-medium">
            <SelectValue className="text-primary" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {matchFormats.map((item) => (
                <SelectItem key={item} value={item}>
                  {matchFormatLabels[item]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </MatchDetailsRow>

      <MatchDetailsRow
        icon={<SlidersHorizontal className="w-4 h-4 text-muted-foreground" />}
        title="Marcar como reservado"
      >
        <SwitchButton
          size="lg"
          checked={isReserved}
          onClick={() => onReservedChange(!isReserved)}
        />
      </MatchDetailsRow>

      <MatchDetailsRow
        icon={<Lock className="w-4 h-4 text-muted-foreground" />}
        title="Partido privado"
      >
        <SwitchButton
          size="lg"
          checked={isPrivate}
          onClick={() => onPrivateChange(!isPrivate)}
        />
      </MatchDetailsRow>
    </BoxContainer>
  );
};

export default MatchDetailsSection;
