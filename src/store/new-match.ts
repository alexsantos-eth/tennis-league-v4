import { type FormEvent } from "react";
import { toast } from "sonner";
import { create } from "zustand";

import { createMatch, createMatchDoc } from "../firebase/match";
import { getAllUsers } from "../firebase/users";
import { rangeStep } from "../pages/match/new/client/contants";
import {
  buildHalfHourTimeOptions,
  formatDateForMatch,
  getClosestHalfHourTime,
} from "../pages/match/new/client/tools/dates";
import { useAuthStore } from "./auth";

import type {
  CreateMatchInput,
  MatchPlayerPosition,
  MatchTeam,
  MatchCreatorSummary,
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../types/match";
import type { User } from "../types/users";
import type { DocumentData, DocumentReference } from "firebase/firestore";
type PlayersTab = "Amigos" | "Global";

const getMaxGuestInvitesByMatchType = (matchType: PublicMatchType) =>
  matchType === "Singles" ? 1 : 3;

const getTeamAndPositionByIndex = (
  index: number,
  matchType: PublicMatchType,
): { team: MatchTeam; position: MatchPlayerPosition } => {
  if (matchType === "Singles") {
    return index === 0
      ? { team: "A", position: 0 }
      : { team: "B", position: 0 };
  }

  switch (index) {
    case 0:
      return { team: "A", position: 0 };
    case 1:
      return { team: "A", position: 1 };
    case 2:
      return { team: "B", position: 0 };
    default:
      return { team: "B", position: 1 };
  }
};

const getDisplayName = (user: Partial<User>) => {
  const fallback = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return user.name || fallback || "Jugador";
};

const mapUserToMatchPlayer = (user: Partial<User>): MatchCreatorSummary => ({
  id: String(user.uid ?? ""),
  uid: user.uid,
  name: getDisplayName(user),
  firstName: user.firstName,
  lastName: user.lastName,
  picture: user.picture,
  gtr: Number(user.utr) || 0,
});

const getInitialNewMatchState = () => ({
  sport: "Tenis" as PublicMatchSport,
  matchType: "Singles" as PublicMatchType,
  matchFormat: "Friendly" as PublicMatchFormat,
  isReserved: false,
  isPrivate: false,
  comments: "",
  location: "",
  matchDate: "",
  matchTime: getClosestHalfHourTime(),
  rangeMin: 2,
  rangeMax: 6,
  isSubmitting: false,
  isDateSheetOpen: false,
  isLocationSheetOpen: false,
  isMatchFormatSheetOpen: false,
  tempDate: undefined as Date | undefined,
  tempLocation: "",
  timeOptions: buildHalfHourTimeOptions(),
  invitedPlayers: [] as MatchCreatorSummary[],
  availablePlayers: [] as User[],
  friendPlayerIds: [] as string[],
  playersTab: "Amigos" as PlayersTab,
  playersSearch: "",
  isLoadingPlayers: false,
});

interface NewMatchState {
  sport: PublicMatchSport;
  matchType: PublicMatchType;
  matchFormat: PublicMatchFormat;
  isReserved: boolean;
  isPrivate: boolean;
  comments: string;
  location: string;
  matchDocRef?: DocumentReference<DocumentData, DocumentData>;
  matchDate: string;
  matchTime: string;
  rangeMin: number;
  rangeMax: number;
  isSubmitting: boolean;
  isDateSheetOpen: boolean;
  isLocationSheetOpen: boolean;
  isMatchFormatSheetOpen: boolean;
  tempDate?: Date;
  tempLocation: string;
  timeOptions: string[];
  invitedPlayers: MatchCreatorSummary[];
  availablePlayers: User[];
  friendPlayerIds: string[];
  playersTab: PlayersTab;
  playersSearch: string;
  isLoadingPlayers: boolean;
  setSport: (sport: PublicMatchSport) => void;
  setMatchType: (matchType: PublicMatchType) => void;
  setMatchFormat: (matchFormat: PublicMatchFormat) => void;
  setIsReserved: (isReserved: boolean) => void;
  setIsPrivate: (isPrivate: boolean) => void;
  setComments: (comments: string) => void;
  setMatchTime: (matchTime: string) => void;
  setIsDateSheetOpen: (isDateSheetOpen: boolean) => void;
  setIsLocationSheetOpen: (isLocationSheetOpen: boolean) => void;
  setIsMatchFormatSheetOpen: (isMatchFormatSheetOpen: boolean) => void;
  setTempDate: (tempDate: Date | undefined) => void;
  setTempLocation: (tempLocation: string) => void;
  openDateSheet: () => void;
  confirmDate: () => void;
  openLocationSheet: () => void;
  confirmLocation: () => void;
  openMatchFormatSheet: () => void;
  confirmMatchFormat: (matchFormat: PublicMatchFormat) => void;
  setSkillRange: (values: number[]) => void;
  setPlayersTab: (playersTab: PlayersTab) => void;
  setPlayersSearch: (playersSearch: string) => void;
  loadAvailablePlayers: () => Promise<void>;
  bootstrapCurrentUserPlayer: () => void;
  resetNewMatchStore: () => void;
  resetInvitedPlayers: () => void;
  toggleInvitedPlayer: (player: User) => void;
  isPlayerInvited: (playerId: string) => boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useNewMatchStore = create<NewMatchState>()((set, get) => ({
  ...getInitialNewMatchState(),
  setSport: (sport) => set({ sport }),
  setMatchType: (matchType) => {
    set((state) => {
      const hostPlayer = state.invitedPlayers[0];
      const guestPlayers = state.invitedPlayers.slice(1);
      const maxGuestInvites = getMaxGuestInvitesByMatchType(matchType);

      return {
        matchType,
        invitedPlayers: hostPlayer
          ? [hostPlayer, ...guestPlayers.slice(0, maxGuestInvites)]
          : guestPlayers.slice(0, maxGuestInvites),
      };
    });
  },
  setMatchFormat: (matchFormat) => set({ matchFormat }),
  setIsReserved: (isReserved) => set({ isReserved }),
  setIsPrivate: (isPrivate) => set({ isPrivate }),
  setComments: (comments) => set({ comments }),
  setMatchTime: (matchTime) => set({ matchTime }),
  setIsDateSheetOpen: (isDateSheetOpen) => set({ isDateSheetOpen }),
  setIsLocationSheetOpen: (isLocationSheetOpen) => set({ isLocationSheetOpen }),
  setIsMatchFormatSheetOpen: (isMatchFormatSheetOpen) =>
    set({ isMatchFormatSheetOpen }),
  setTempDate: (tempDate) => set({ tempDate }),
  setTempLocation: (tempLocation) => set({ tempLocation }),
  openDateSheet: () => {
    const { matchDate, matchTime } = get();

    set({
      tempDate: matchDate ? new Date(matchDate) : undefined,
      matchTime: matchTime || getClosestHalfHourTime(),
      isDateSheetOpen: true,
    });
  },
  confirmDate: () => {
    const { tempDate } = get();

    set({
      matchDate: tempDate ? formatDateForMatch(tempDate) : get().matchDate,
      isDateSheetOpen: false,
    });
  },
  openLocationSheet: () => {
    const { location } = get();
    set({ tempLocation: location, isLocationSheetOpen: true });
  },
  confirmLocation: () => {
    const { tempLocation } = get();
    set({ location: tempLocation.trim(), isLocationSheetOpen: false });
  },
  openMatchFormatSheet: () => {
    set({ isMatchFormatSheetOpen: true });
  },
  confirmMatchFormat: (matchFormat) => {
    set({ matchFormat, isMatchFormatSheetOpen: false });
  },
  setSkillRange: (values) => {
    const [nextMin, nextMax] = values;
    const { rangeMin, rangeMax } = get();

    const min = Math.min(nextMin, rangeMax - rangeStep);
    const max = Math.max(nextMax, rangeMin + rangeStep);

    set({ rangeMin: min, rangeMax: max });
  },
  setPlayersTab: (playersTab) => set({ playersTab }),
  setPlayersSearch: (playersSearch) => set({ playersSearch }),
  bootstrapCurrentUserPlayer: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    const currentUserId = String(currentUser?.uid ?? "");

    if (!currentUser || !currentUserId) {
      return;
    }

    const currentUserPlayer = mapUserToMatchPlayer(currentUser);

    const matchDocRef = await createMatchDoc()
    
    set((state) => {
      const existing = state.invitedPlayers.some(
        (player) => player.id === currentUserId,
      );

      if (existing) {
        return {
          invitedPlayers: state.invitedPlayers.map((player) =>
            player.id === currentUserId ? currentUserPlayer : player,
          ),
        };
      }

      return {
        matchDocRef,
        invitedPlayers: [currentUserPlayer, ...state.invitedPlayers],
      };
    });
  },
  resetInvitedPlayers: () => {
    set((state) => ({
      invitedPlayers: state.invitedPlayers[0] ? [state.invitedPlayers[0]] : [],
    }));
  },
  resetNewMatchStore: () => {
    set(getInitialNewMatchState());
  },
  loadAvailablePlayers: async () => {
    const currentUserId = String(
      useAuthStore.getState().currentUser?.uid ?? "",
    );
    set({ isLoadingPlayers: true });

    try {
      const players = await getAllUsers();
      const filteredPlayers = players.filter(
        (player) => String(player.uid ?? "") !== currentUserId,
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
  toggleInvitedPlayer: (player) => {
    const playerId = String(player.uid ?? "");
    const currentUserId = String(
      useAuthStore.getState().currentUser?.uid ?? "",
    );

    if (!playerId || playerId === currentUserId) {
      return;
    }

    set((state) => {
      const alreadyInvited = state.invitedPlayers.some(
        (item) => item.id === playerId,
      );

      if (alreadyInvited) {
        return {
          invitedPlayers: state.invitedPlayers.filter(
            (item) => item.id !== playerId,
          ),
        };
      }

      const hostPlayer = state.invitedPlayers[0];
      const guestPlayers = state.invitedPlayers.slice(1);
      const maxGuestInvites = getMaxGuestInvitesByMatchType(state.matchType);

      if (guestPlayers.length >= maxGuestInvites) {
        return state;
      }

      const nextGuestPlayers = [...guestPlayers, mapUserToMatchPlayer(player)];

      return {
        invitedPlayers: hostPlayer
          ? [hostPlayer, ...nextGuestPlayers]
          : nextGuestPlayers,
      };
    });
  },
  isPlayerInvited: (playerId) => {
    return get().invitedPlayers.some((player) => player.id === playerId);
  },
  handleSubmit: async (event) => {
    event.preventDefault();

    const currentUser = useAuthStore.getState().currentUser;
    const currentUserId = String(currentUser?.id ?? currentUser?.uid);

    if (!currentUser || !currentUserId) {
      toast.error("Debes iniciar sesión para crear un partido.");
      return;
    }

    const {
      sport,
      matchType,
      matchFormat,
      isReserved,
      isPrivate,
      comments,
      rangeMin,
      rangeMax,
      matchDate,
      matchTime,
      location,
      invitedPlayers,
    } = get();

    const [hostPlayer, ...guestPlayers] = invitedPlayers;

    if (!hostPlayer) {
      toast.error("No se pudo identificar al creador del partido.");
      return;
    }

    const hostAssignment = getTeamAndPositionByIndex(0, matchType);
    const invitedPlayersWithAssignments = guestPlayers.map((player, index) => ({
      ...player,
      ...getTeamAndPositionByIndex(index + 1, matchType),
    }));

    const payload: CreateMatchInput = {
      sport,
      matchType,
      matchFormat,
      isReserved,
      isPrivate,
      comments,
      skillRange: {
        min: rangeMin,
        max: rangeMax,
      },
      dateOfMatch: matchDate,
      timeOfMatch: matchTime,
      location,
      createdBy: {
        ...hostPlayer,
        ...hostAssignment,
      },
      invitedPlayers: invitedPlayersWithAssignments,
    };

    try {
      set({ isSubmitting: true });


      const matchDocRef  = get().matchDocRef;

      await createMatch(payload, matchDocRef);
      toast.success("Partido creado exitosamente.");

      window.location.href = "/";
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Error creating match.");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
