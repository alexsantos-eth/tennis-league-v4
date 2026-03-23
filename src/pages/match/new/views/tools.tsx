export const getClosestHalfHourTime = (date: Date = new Date()) => {
  const minutesInDay = 24 * 60;
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const roundedMinutes = Math.round(totalMinutes / 30) * 30;
  const normalizedMinutes = roundedMinutes % minutesInDay;
  const hour = Math.floor(normalizedMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (normalizedMinutes % 60).toString().padStart(2, "0");

  return `${hour}:${minute}`;
};

export const buildHalfHourTimeOptions = () =>
  Array.from({ length: 48 }, (_, index) => {
    const totalMinutes = index * 30;
    const hour = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minute = (totalMinutes % 60).toString().padStart(2, "0");

    return `${hour}:${minute}`;
  });

export const formatDateForMatch = (date: Date) =>
  date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
  });
