import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getAllUsers } from "../firebase/users";
import type { MatchCreatorSummary } from "../types/match";
import type { User } from "../types/users";
import { useAuthStore } from "./auth";

type PlayersTab = "Amigos" | "Global";

const mapUserToMatchPlayer = (user: Partial<User>): MatchCreatorSummary => {
  const displayName = user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Jugador";
  return {
    id: String(user.uid ?? ""),
    uid: user.uid,
    name: displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    picture: user.picture,
    gtr: Number(user.utr) || 0,
    confirmed: false,
  };
};

const getInitialState = () => ({
  matchId: "",
  availablePlayers: [] as User[],
  friendPlayerIds: [] as string[],
  playersTab: "Amigos" as PlayersTab,
  playersSearch: "",
  isLoadingPlayers: false,
});

interface MatchDetailPlayersState {
  matchId: string;
  availablePlayers: User[];
  friendPlayerIds: string[];
  playersTab: PlayersTab;
  playersSearch: string;
  isLoadingPlayers: boolean;
  setMatchId: (matchId: string) => void;
  setPlayersTab: (playersTab: PlayersTab) => void;
  setPlayersSearch: (playersSearch: string) => void;
  loadAvailablePlayers: () => Promise<void>;
  resetStore: () => void;
}

export const useMatchDetailPlayersStore = create<MatchDetailPlayersState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      setMatchId: (matchId) => set({ matchId }),
      setPlayersTab: (playersTab) => set({ playersTab }),
      setPlayersSearch: (playersSearch) => set({ playersSearch }),
      loadAvailablePlayers: async () => {
        const currentUserId = String(
          useAuthStore.getState().currentUser?.uid ?? ""
        );
        set({ isLoadingPlayers: true });

        try {
          const players = await getAllUsers();
          const filteredPlayers = players.filter(
            (player) => String(player.uid ?? "") !== currentUserId
          );

          set({
            availablePlayers: filteredPlayers,
            friendPlayerIds: filteredPlayers
              .slice(0, 8)
              .map((player) => String(player.uid ?? "")),
          });
        } catch (error) {
          console.error("Error loading players:", error);
          set({ availablePlayers: [], friendPlayerIds: [] });
        } finally {
          set({ isLoadingPlayers: false });
        }
      },
      resetStore: () => {
        set(getInitialState());
      },
    }),
    {
      name: "match-detail-players-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
