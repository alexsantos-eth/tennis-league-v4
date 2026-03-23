import { If, Then } from "react-if";

import { Button } from "../../../components/ui/button";
import Text from "../../../components/ui/text";

interface EventCardProps {
  title?: string;
  description?: string;
  link?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, link }) => {
  return (
    <div className="snap-center w-full drop-shadow-lg relative bg-[url(/images/events/background.png)] bg-cover rounded-2xl overflow-hidden mx-6">
      <div className="pointer-events-none absolute left-0 right-0 top-0 bottom-0 bg-linear-to-r from-black/80 to-transparent"></div>

      <div className="relative z-2 px-4 py-4 flex flex-col gap-2">
        <If condition={(title?.length ?? 0) > 0}>
          <Then>
            <Text
              variant="bodyLarge"
              className="font-bold text-primary-foreground leading-6"
            >
              {title}
            </Text>
          </Then>
        </If>

        <If condition={(description?.length ?? 0) > 0}>
          <Then>
            <Text variant="body" className="text-primary-foreground max-w-55">
              {description}
            </Text>
          </Then>
        </If>

        <If condition={(link?.length ?? 0) > 0}>
          <Then>
            <a href={link!}>
              <Button size="lg" variant="secondary" className="px-4">
                Ver más
              </Button>
            </a>
          </Then>
        </If>
      </div>
    </div>
  );
};

export default EventCard;
