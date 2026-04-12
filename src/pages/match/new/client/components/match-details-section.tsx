import { Lock, SlidersHorizontal, Users2 } from "lucide-react";

import BoxContainer from "@/components/ui/container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch as SwitchButton } from "@/components/ui/switch";
import { useNewMatchStore } from "@/store/new-match";

import { matchFormatLabels, matchFormats } from "../contants";
import MatchDetailsRow from "./match-details-row";

import type { PublicMatchFormat } from "@/types/match";
const MatchDetailsSection: React.FC = () => {
  const matchFormat = useNewMatchStore((state) => state.matchFormat);
  const isReserved = useNewMatchStore((state) => state.isReserved);
  const isPrivate = useNewMatchStore((state) => state.isPrivate);
  const setMatchFormat = useNewMatchStore((state) => state.setMatchFormat);
  const setIsReserved = useNewMatchStore((state) => state.setIsReserved);
  const setIsPrivate = useNewMatchStore((state) => state.setIsPrivate);

  return (
    <BoxContainer className="flex flex-col gap-4" title="Detalles de partido">
      <MatchDetailsRow
        title="Tipo"
        icon={<Users2 className="w-4 h-4 text-muted-foreground" />}
      >
        <Select
          value={matchFormat}
          onValueChange={(value) => setMatchFormat(value as PublicMatchFormat)}
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
          onClick={() => setIsReserved(!isReserved)}
        />
      </MatchDetailsRow>

      <MatchDetailsRow
        icon={<Lock className="w-4 h-4 text-muted-foreground" />}
        title="Partido privado"
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
