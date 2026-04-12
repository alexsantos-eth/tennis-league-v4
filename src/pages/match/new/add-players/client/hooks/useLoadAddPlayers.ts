import { useAuthStore } from "@/store/auth";
import { useNewMatchStore } from "@/store/new-match";
import { useEffect } from "react";

const useLoadAddPlayers = () => {
  const loadAvailablePlayers = useNewMatchStore(
    (state) => state.loadAvailablePlayers,
  );

  const bootstrapCurrentUserPlayer = useNewMatchStore(
    (state) => state.bootstrapCurrentUserPlayer,
  );

  const currentUserUid = useAuthStore((state) => state.currentUser?.uid);

  useEffect(() => {
    bootstrapCurrentUserPlayer();
    void loadAvailablePlayers();
  }, [bootstrapCurrentUserPlayer, loadAvailablePlayers, currentUserUid]);
};

export default useLoadAddPlayers;
