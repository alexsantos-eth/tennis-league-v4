import Stack from "@/components/ui/stack";

import MatchHistoryList from "./components/match-history-list";
import useMatchHistory from "./hooks/use-match-history";

const MatchHistoryPage: React.FC = () => {
  const { matches, isLoading, hasError } = useMatchHistory();

  return (
    <Stack className="w-full pb-8 overflow-scroll h-full no-scrollbar" noPx>
      <MatchHistoryList
        matches={matches}
        isLoading={isLoading}
        hasError={hasError}
      />
    </Stack>
  );
};

export default MatchHistoryPage;