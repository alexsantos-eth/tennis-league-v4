import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  MapPin,
} from "lucide-react";

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
import Stack from "@/components/ui/stack";
import MatchButtonRow from "./match-button-row";

const LocationSheet: React.FC = () => {
  const open = useNewMatchStore((state) => state.isLocationSheetOpen);
  const tempLocation = useNewMatchStore((state) => state.tempLocation);
  const setIsLocationSheetOpen = useNewMatchStore(
    (state) => state.setIsLocationSheetOpen,
  );
  const setTempLocation = useNewMatchStore((state) => state.setTempLocation);
  const confirmLocation = useNewMatchStore((state) => state.confirmLocation);

  const setLocationAndClose = (location: string) => () => {
    setTempLocation(location);
    confirmLocation();
  }

  return (
    <Sheet open={open} onOpenChange={setIsLocationSheetOpen}>
      <SheetContent side="bottom" aria-describedby="location-sheet-description">
        <SheetHeader>
          <SheetTitle>Selecciona una ubicacion</SheetTitle>
        </SheetHeader>

        <Stack className="pb-6">
          <BoxContainer
            title="Clubes mas populares"
            className="p-0 overflow-hidden border border-border"
          >
            {popularClubs.map((club) => (
              <MatchButtonRow
                key={club}
                onClick={setLocationAndClose(club)}
                icon={<Building2 className="h-4 w-4" />}
                title={club}
              >
                {tempLocation === club ? (
                  <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                ) : (
                  <ChevronRight className="h-5 w-5 text-primary" />
                )}
              </MatchButtonRow>
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
        </Stack>
      </SheetContent>
    </Sheet>
  );
};

export default LocationSheet;
