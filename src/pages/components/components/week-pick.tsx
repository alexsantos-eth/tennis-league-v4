"use client";
import Text from "../../../components/ui/text";
import CalendarDay from "./calendar-day";

interface WeekPickProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WeekPick = ({ selectedDate, onDateSelect }: WeekPickProps) => {
  const startDate = new Date(selectedDate);
  startDate.setDate(selectedDate.getDate() - 1);

  const weekDates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });

  const selectedDateLocale = selectedDate.toLocaleDateString("es", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const selectedDateLocaleCapitalized = selectedDateLocale.replace(/\b\p{L}/gu, (char) =>
    char.toUpperCase(),
  );

  return (
    <div className="flex flex-col gap-4">
      <Text variant="h3" className="text-foreground px-6">
        {selectedDateLocaleCapitalized}
      </Text>

      <div className="flex flex-col w-full overflow-scroll snap-x snap-mandatory scrollbar-hide px-6">
        <div className="flex w-max gap-4">
          {weekDates.map((date) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              isSelected={date.toDateString() === selectedDate.toDateString()}
              onClick={() => onDateSelect(date)}
            />
          ))}

          <div className="snap-end w-19 h-19" />
        </div>
      </div>
    </div>
  );
};

export default WeekPick;
