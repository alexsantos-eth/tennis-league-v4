import { UserIcon, UsersIcon } from "lucide-react";

import BoxContainer from "@/components/ui/container";
import { useNewMatchStore } from "@/store/new-match";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { matchTypes } from "../contants";

const MatchTypeSection: React.FC = () => {
  const matchType = useNewMatchStore((state) => state.matchType);
  const setMatchType = useNewMatchStore((state) => state.setMatchType);

  return (
    <BoxContainer title="Tipo de partido" className="p-2">
      <Tabs value={matchType} className="bg-background w-full">
        <TabsList variant="default" className="w-full p-0">
          {matchTypes.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="h-8"
              onClick={() => setMatchType(item)}
            >
              {item === "Doubles" && <UsersIcon />}
              {item === "Singles" && <UserIcon />}
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </BoxContainer>
  );
};

export default MatchTypeSection;
