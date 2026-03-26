import BoxContainer from "../../../components/ui/container";
import Text from "../../../components/ui/text";

interface CalendarDayProps {
  date: Date;
  isSelected?: boolean;
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isSelected,
  onClick,
}) => {
  const dayOfWeek = date
    .toLocaleDateString("es", { weekday: "short" })
    .toUpperCase()
    .substring(0, 2)

  const dayOfMonth = date.getDate();

  if (isSelected) {
    return (
      <BoxContainer className="snap-start p-0 bg-primary min-w-16 min-h-16 max-h-16 flex flex-col items-center justify-center">
        <Text variant="bodySmall" className="text-white font-semibold">
          {dayOfWeek}
        </Text>

        <Text variant="h4" className="text-white">
          {dayOfMonth}
        </Text>
      </BoxContainer>
    );
  }

  return (
    <BoxContainer
      className="border snap-start p-0 min-w-16 w-16 h-16 max-h-16 flex flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <Text variant="bodySmall" className="text-muted-foreground font-semibold">
        {dayOfWeek}
      </Text>

      <Text variant="h4" className="text-muted-foreground">
        {dayOfMonth}
      </Text>
    </BoxContainer>
  );
};

export default CalendarDay;
