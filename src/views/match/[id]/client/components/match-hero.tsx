import { Badge } from "@/components/ui/badge";
import Text from "@/components/ui/text";

import type { MatchRecord } from "@/types/match";

interface MatchHeroProps {
  match: MatchRecord;
}

const MatchHero: React.FC<MatchHeroProps> = ({ match }) => {
  return (
    <section className="relative h-60 overflow-hidden">
      <img
        src={`/images/match/${match.sport.toLowerCase()}.png`}
        alt="Cancha"
        className="w-full object-cover h-60 fixed top-0"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-black/20" />

      <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col">
        <Badge
          variant="secondary"
          className="w-fit bg-white/20 text-white border-white/20"
        >
          {match.sport}
        </Badge>

        <Text variant="h3" className="text-white leading-12">
          Partido de {match.matchType}
        </Text>

        <Text variant="bodyLarge" className="text-white/90 font-medium -mt-2">
          Organizado en {match.location}
        </Text>
      </div>
    </section>
  );
};

export default MatchHero;
