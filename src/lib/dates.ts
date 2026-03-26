export const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const normalizeMatchDateKey = (dateOfMatch: string, selectedDate: Date) => {
  const normalizedInput = dateOfMatch.trim().split("T")[0];

  const isoMatch = normalizedInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    return normalizedInput;
  }

  const slashMatch = normalizedInput.match(
    /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/,
  );

  if (slashMatch) {
    const day = String(Number(slashMatch[1])).padStart(2, "0");
    const month = String(Number(slashMatch[2])).padStart(2, "0");
    const parsedYear = slashMatch[3]
      ? Number(slashMatch[3])
      : selectedDate.getFullYear();
    const year = parsedYear < 100 ? parsedYear + 2000 : parsedYear;

    return `${year}-${month}-${day}`;
  }

  return normalizedInput;
};