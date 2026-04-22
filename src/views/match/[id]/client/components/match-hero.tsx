import { ArrowLeft, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";

import type { MatchRecord } from "@/types/match";
import { shareLink } from "@/lib/share";

interface MatchHeroProps {
  match: MatchRecord;
  scrollOpacity: number;
}

const MatchHero: React.FC<MatchHeroProps> = ({ match, scrollOpacity }) => {
  const onShare = async () => {
    shareLink(window.location.href, "Partido compartido");
  };

  const invertedForegroundColor = 255 - scrollOpacity * 255;

  return (
    <section className="relative h-60 overflow-hidden">
      <img
        src={`/images/match/${match.sport.toLowerCase()}.png`}
        alt="Cancha"
        className="w-full object-cover h-60 fixed top-0"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-black/20" />

      <div
        className="fixed top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-50"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${scrollOpacity * 0.99})`,
          boxShadow: "0px 5px 5px -1px rgba(0,0,0,0.02)",
        }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-transparent animate-fade-right text-primary-foreground transition-none"
          style={{
            color: `rgba(${invertedForegroundColor}, ${invertedForegroundColor}, ${invertedForegroundColor}, 1)`,
          }}
          onClick={() => history.back()}
        >
          <ArrowLeft />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-transparent animate-fade-left text-primary-foreground transition-none"
          style={{
            color: `rgba(${invertedForegroundColor}, ${invertedForegroundColor}, ${invertedForegroundColor}, 1)`,
          }}
          onClick={onShare}
        >
          <Share2 />
        </Button>
      </div>

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
