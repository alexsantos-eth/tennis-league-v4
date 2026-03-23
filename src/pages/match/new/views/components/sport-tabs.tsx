import {
  CircleDotDashed,
  CircleEqualIcon,
  CircleSlash2Icon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { sports } from "../contants";
import type { PublicMatchSport } from "../../../../../types/match";

interface SportTabsProps {
  sport: PublicMatchSport;
  onSportChange: (sport: PublicMatchSport) => void;
}

const SportTabs: React.FC<SportTabsProps> = ({ sport, onSportChange }) => {
  return (
    <Tabs value={sport} className="bg-background w-full px-6 py-5">
      <TabsList variant="default" className="w-full">
        {sports.map((item) => (
          <TabsTrigger
            key={item}
            value={item}
            className="h-8"
            onClick={() => onSportChange(item)}
          >
            {item === "Tenis" && <CircleSlash2Icon />}
            {item === "Padel" && <CircleEqualIcon />}
            {item === "Pickleball" && <CircleDotDashed />}
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SportTabs;
