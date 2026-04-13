import PadelIcon from "@/components/icons/padel";
import PickleballIcon from "@/components/icons/pickleball";
import TenisIcon from "@/components/icons/tenis";
import Text from "@/components/ui/text";
import { cn } from "@/lib/styles";
import { useNewMatchStore } from "@/store/new-match";

import { sports } from "../contants";

const SportTabs: React.FC = () => {
  const sport = useNewMatchStore((state) => state.sport);
  const setSport = useNewMatchStore((state) => state.setSport);

  return (
    <div className="grid grid-cols-3 bg-background w-full px-6 py-5">
      {sports.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setSport(item)}
          className={cn(
            "flex flex-col items-center py-2 gap-2",
            item === sport && "border-primary/60 border-2 rounded-xl",
          )}
        >
          <span
            className={cn(
              "text-5xl",
              item === sport ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item === "Padel" && <PadelIcon />}
            {item === "Tenis" && <TenisIcon />}
            {item === "Pickleball" && <PickleballIcon />}
          </span>

          <Text
            variant="bodySmall"
            className={cn(
              item === sport
                ? "text-primary font-semibold"
                : "text-muted-foreground",
            )}
          >
            {item}
          </Text>
        </button>
      ))}
    </div>
  );
};

export default SportTabs;
