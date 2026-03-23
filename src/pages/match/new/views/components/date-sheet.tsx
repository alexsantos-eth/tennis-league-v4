import { CheckCheck } from "lucide-react";
import { es } from "react-day-picker/locale";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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

import { Button } from "../../../../../components/ui/button";
import BoxContainer from "../../../../../components/ui/container";

interface DateSheetProps {
  open: boolean;
  selectedDate?: Date;
  selectedTime: string;
  timeOptions: string[];
  onOpenChange: (open: boolean) => void;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
}

const DateSheet: React.FC<DateSheetProps> = ({
  open,
  selectedDate,
  selectedTime,
  timeOptions,
  onOpenChange,
  onDateChange,
  onTimeChange,
  onConfirm,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" aria-describedby="date-sheet-description">
        <SheetHeader className="flex-row justify-between items-center">
          <SheetTitle>Selecciona una fecha</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center justify-center w-full px-6 gap-6">
          <CalendarComponent
            locale={es}
            className="w-full max-w-90"
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={onDateChange}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />

          <Select value={selectedTime} onValueChange={onTimeChange}>
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
        </div>

        <SheetFooter>
          <Button
            size="lg"
            type="button"
            onClick={onConfirm}
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
