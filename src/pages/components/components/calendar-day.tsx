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
    .substring(0, 2)
    .toUpperCase();
  const dayOfMonth = date.getDate();

  if (isSelected) {
    return (
      <BoxContainer className="snap-end p-0 bg-primary min-w-19 min-h-19 flex flex-col items-center justify-center">
        <Text variant="bodySmall" className="text-white font-semibold">
          {dayOfWeek}
        </Text>

        <Text variant="h2" className="text-white">
          {dayOfMonth}
        </Text>
      </BoxContainer>
    );
  }

  return (
    <BoxContainer
      className="snap-end p-0 w-19 h-19 flex flex-col items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <Text variant="bodySmall" className="text-muted-foreground font-semibold">
        {dayOfWeek}
      </Text>

      <Text variant="h2" className="text-muted-foreground">
        {dayOfMonth}
      </Text>
    </BoxContainer>
  );
};

export default CalendarDay;
