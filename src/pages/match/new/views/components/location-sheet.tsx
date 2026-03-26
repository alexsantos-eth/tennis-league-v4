import { ArrowRight, Building2, ChevronRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";

import { popularClubs } from "../contants";

const LocationSheet: React.FC = () => {
  const open = useNewMatchStore((state) => state.isLocationSheetOpen);
  const tempLocation = useNewMatchStore((state) => state.tempLocation);
  const setIsLocationSheetOpen = useNewMatchStore(
    (state) => state.setIsLocationSheetOpen,
  );
  const setTempLocation = useNewMatchStore((state) => state.setTempLocation);
  const confirmLocation = useNewMatchStore((state) => state.confirmLocation);

  return (
    <Sheet open={open} onOpenChange={setIsLocationSheetOpen}>
      <SheetContent side="bottom" aria-describedby="location-sheet-description">
        <SheetHeader>
          <SheetTitle>Selecciona una ubicacion</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <BoxContainer
            title="Clubes mas populares"
            className="p-0 overflow-hidden border border-border"
          >
            {popularClubs.map((club) => (
              <button
                key={club}
                type="button"
                className="w-full px-4 py-4 flex items-center gap-3 border-b border-border/70 last:border-b-0"
                onClick={() => setTempLocation(club)}
              >
                <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </span>

                <Text
                  variant="bodySmall"
                  className="flex-1 text-left text-base font-medium text-foreground"
                >
                  {club}
                </Text>

                <ChevronRight className="h-5 w-5 text-primary" />
              </button>
            ))}
          </BoxContainer>

          <BoxContainer
            className="overflow-hidden border border-border flex gap-4"
            onClick={() => setTempLocation("")}
          >
            <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </span>

            <div>
              <Text
                variant="bodySmall"
                className="text-base font-medium text-foreground"
              >
                Otro club o cancha privada
              </Text>
              <Text
                variant="bodySmall"
                className="text-sm text-muted-foreground max-w-50"
              >
                Cancha de tu condominio, club exclusivo y mas.
              </Text>
            </div>
          </BoxContainer>

          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={tempLocation}
              onChange={(event) => setTempLocation(event.target.value)}
              placeholder="Nombre del club o cancha"
            />

            <Button
              type="button"
              size="icon-lg"
              className="h-10 w-10 rounded-xl"
              onClick={confirmLocation}
              disabled={!tempLocation.trim()}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LocationSheet;
