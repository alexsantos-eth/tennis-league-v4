import { useRef } from "react";

import Text from "@/components/ui/text";
import CalendarDay from "./calendar-day";

interface WeekPickProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WeekPick = ({ selectedDate, onDateSelect }: WeekPickProps) => {
  const startDate = new Date(selectedDate);
  startDate.setDate(selectedDate.getDate() - 1);

  const scrollRef = useRef<HTMLDivElement>(null);

  const weekDates = Array.from({ length: 15 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });

  const selectedDateLocale = selectedDate.toLocaleDateString("es", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const selectedDateLocaleCapitalized = `${selectedDateLocale[0].toUpperCase()}${selectedDateLocale.slice(1)}`;

  const onDayClick = (date: Date) => {
    onDateSelect(date);

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-2">
      <Text variant="bodyLarge" className="font-bold text-foreground px-6">
        {selectedDateLocaleCapitalized}
      </Text>

      <div
        ref={scrollRef}
        className="flex flex-col max-w-full overflow-scroll snap-x snap-mandatory scrollbar-hide mx-6"
      >
        <div className="flex gap-4">
          {weekDates.map((date) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              isSelected={date.toDateString() === selectedDate.toDateString()}
              onClick={() => onDayClick(date)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekPick;
