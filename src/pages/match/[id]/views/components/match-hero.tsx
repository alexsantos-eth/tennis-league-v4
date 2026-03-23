import { ArrowLeft, Share2 } from "lucide-react";

import { Badge } from "../../../../../components/ui/badge";
import { Button } from "../../../../../components/ui/button";
import Text from "../../../../../components/ui/text";

import type { MatchRecord } from "../../../../../types/match";

interface MatchHeroProps {
  match: MatchRecord;
}

const MatchHero: React.FC<MatchHeroProps> = ({ match }) => {
  const onShare = async () => {
    const title = `${match.matchType} ${match.sport}`;
    const text = `${match.matchFormat} en ${match.location}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // no-op
    }
  };

  return (
    <section className="relative h-60 overflow-hidden">
      <img
        src="/images/events/background.png"
        alt="Cancha"
        className="w-full object-cover h-60 fixed top-0"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-black/20" />

      <div className="absolute top-4 left-0 w-full px-6 flex items-center justify-between">
        <Button
          type="button"
   variant="outline"
              size="icon"
              className="bg-transparent animate-fade-right text-primary-foreground"
          onClick={() => history.back()}
        >
          <ArrowLeft />
        </Button>

        <Button
          type="button"
    variant="outline"
              size="icon"
              className="bg-transparent animate-fade-left text-primary-foreground"
          onClick={onShare}
        >
          <Share2 />
        </Button>
      </div>

      <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col    ">
        <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/20">
          {match.sport}
        </Badge>

        <Text variant="h3" className="text-white leading-12">
          Partido de {match.matchType}
        </Text>

        <Text variant="bodyLarge" className="text-white/90 font-medium -mt-2">
          Organizado por {match.location}
        </Text>
      </div>
    </section>
  );
};

export default MatchHero;
