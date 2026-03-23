import {
  CircleDotDashed,
  CircleEqualIcon,
  CircleSlash2Icon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { useNewMatchStore } from "../../../../../store/new-match";
import { sports } from "../contants";

const SportTabs: React.FC = () => {
  const sport = useNewMatchStore((state) => state.sport);
  const setSport = useNewMatchStore((state) => state.setSport);

  return (
    <Tabs value={sport} className="bg-background w-full px-6 py-5">
      <TabsList variant="default" className="w-full">
        {sports.map((item) => (
          <TabsTrigger
            key={item}
            value={item}
            className="h-8"
            onClick={() => setSport(item)}
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
