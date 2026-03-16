export const calculateRankingByUTR = (
  loguedUserUtr: string,
  users: { utr: string }[]
): string => {
  const userUtrNumber = parseFloat(loguedUserUtr);
  const sortedUsers = users
    .map((user) => parseFloat(user.utr))
    .sort((a, b) => b - a);
  const rankingPosition = sortedUsers.indexOf(userUtrNumber) + 1;

  return String(rankingPosition);
};
