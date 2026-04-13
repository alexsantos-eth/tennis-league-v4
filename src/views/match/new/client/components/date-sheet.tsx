import { CheckCheck } from "lucide-react";
import { es } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import BoxContainer from "@/components/ui/container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewMatchStore } from "@/store/new-match";
import Stack from "@/components/ui/stack";

const DateSheet: React.FC = () => {
  const open = useNewMatchStore((state) => state.isDateSheetOpen);
  const selectedDate = useNewMatchStore((state) => state.tempDate);
  const selectedTime = useNewMatchStore((state) => state.matchTime);
  const timeOptions = useNewMatchStore((state) => state.timeOptions);
  const setIsDateSheetOpen = useNewMatchStore(
    (state) => state.setIsDateSheetOpen,
  );
  const setTempDate = useNewMatchStore((state) => state.setTempDate);
  const setMatchTime = useNewMatchStore((state) => state.setMatchTime);
  const confirmDate = useNewMatchStore((state) => state.confirmDate);

  return (
    <Sheet open={open} onOpenChange={setIsDateSheetOpen}>
      <SheetContent side="bottom" aria-describedby="date-sheet-description">
        <SheetHeader className="flex-row justify-between items-center">
          <SheetTitle>Selecciona una fecha</SheetTitle>
        </SheetHeader>

        <Stack className="w-full">
          <CalendarComponent
            locale={es}
            className="w-full mx-auto max-w-90 min-h-90"
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={setTempDate}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />

          <Select value={selectedTime} onValueChange={setMatchTime}>
            <BoxContainer title="Selecciona una hora" className="p-0 w-full">
              <SelectTrigger size="lg" className="w-full">
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
            </BoxContainer>

            <SelectContent className="max-w-25">
              <SelectGroup>
                {timeOptions.map((time) => (
                  <SelectItem className="text-lg" key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Stack>

        <SheetFooter>
          <Button
            size="lg"
            type="button"
            onClick={confirmDate}
            className="flex-1 rounded-xl"
            disabled={!selectedDate}
          >
            <CheckCheck />
            Confirmar
          </Button>

          <SheetClose className="w-full" asChild>
            <Button
              size="lg"
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl w-full"
            >
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DateSheet;
