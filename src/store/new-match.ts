import { type FormEvent } from "react";
import { create } from "zustand";

import { createMatch } from "../firebase/match";
import { getAllUsers } from "../firebase/users";
import type {
	CreateMatchInput,
	MatchCreatorSummary,
	PublicMatchFormat,
	PublicMatchSport,
	PublicMatchType,
} from "../types/match";
import { rangeStep } from "../pages/match/new/views/contants";
import {
	buildHalfHourTimeOptions,
	formatDateForMatch,
	getClosestHalfHourTime,
} from "../pages/match/new/views/tools";
import { useAuthStore } from "./auth";
import type { User } from "../types/users";

type PlayersTab = "Amigos" | "Global";

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

interface NewMatchState {
	sport: PublicMatchSport;
	matchType: PublicMatchType;
	matchFormat: PublicMatchFormat;
	isReserved: boolean;
	isPrivate: boolean;
	comments: string;
	location: string;
	matchDate: string;
	matchTime: string;
	rangeMin: number;
	rangeMax: number;
	isSubmitting: boolean;
	isDateSheetOpen: boolean;
	isLocationSheetOpen: boolean;
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
	setTempDate: (tempDate: Date | undefined) => void;
	setTempLocation: (tempLocation: string) => void;
	openDateSheet: () => void;
	confirmDate: () => void;
	openLocationSheet: () => void;
	confirmLocation: () => void;
	setSkillRange: (values: number[]) => void;
	setPlayersTab: (playersTab: PlayersTab) => void;
	setPlayersSearch: (playersSearch: string) => void;
	loadAvailablePlayers: () => Promise<void>;
	bootstrapCurrentUserPlayer: () => void;
	toggleInvitedPlayer: (player: User) => void;
	isPlayerInvited: (playerId: string) => boolean;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useNewMatchStore = create<NewMatchState>((set, get) => ({
	sport: "Tenis",
	matchType: "Doubles",
	matchFormat: "Ranking",
	isReserved: false,
	isPrivate: true,
	comments: "",
	location: "",
	matchDate: "",
	matchTime: getClosestHalfHourTime(),
	rangeMin: 2,
	rangeMax: 6,
	isSubmitting: false,
	isDateSheetOpen: false,
	isLocationSheetOpen: false,
	tempDate: undefined,
	tempLocation: "",
	timeOptions: buildHalfHourTimeOptions(),
	invitedPlayers: [],
	availablePlayers: [],
	friendPlayerIds: [],
	playersTab: "Amigos",
	playersSearch: "",
	isLoadingPlayers: false,
	setSport: (sport) => set({ sport }),
	setMatchType: (matchType) => set({ matchType }),
	setMatchFormat: (matchFormat) => set({ matchFormat }),
	setIsReserved: (isReserved) => set({ isReserved }),
	setIsPrivate: (isPrivate) => set({ isPrivate }),
	setComments: (comments) => set({ comments }),
	setMatchTime: (matchTime) => set({ matchTime }),
	setIsDateSheetOpen: (isDateSheetOpen) => set({ isDateSheetOpen }),
	setIsLocationSheetOpen: (isLocationSheetOpen) => set({ isLocationSheetOpen }),
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
	setSkillRange: (values) => {
		const [nextMin, nextMax] = values;
		const { rangeMin, rangeMax } = get();

		const min = Math.min(nextMin, rangeMax - rangeStep);
		const max = Math.max(nextMax, rangeMin + rangeStep);

		set({ rangeMin: min, rangeMax: max });
	},
	setPlayersTab: (playersTab) => set({ playersTab }),
	setPlayersSearch: (playersSearch) => set({ playersSearch }),
	bootstrapCurrentUserPlayer: () => {
		const currentUser = useAuthStore.getState().currentUser;
		const currentUserId = String(currentUser?.uid ?? "");

		if (!currentUser || !currentUserId) {
			return;
		}

		const currentUserPlayer = mapUserToMatchPlayer(currentUser);

		set((state) => {
			const existing = state.invitedPlayers.some((player) => player.id === currentUserId);

			if (existing) {
				return {
					invitedPlayers: state.invitedPlayers.map((player) => (
						player.id === currentUserId ? currentUserPlayer : player
					)),
				};
			}

			return {
				invitedPlayers: [currentUserPlayer, ...state.invitedPlayers],
			};
		});
	},
	loadAvailablePlayers: async () => {
		const currentUserId = String(useAuthStore.getState().currentUser?.uid ?? "");
		set({ isLoadingPlayers: true });

		try {
			const players = await getAllUsers();
			const filteredPlayers = players.filter((player) => String(player.uid ?? "") !== currentUserId);

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
		const currentUserId = String(useAuthStore.getState().currentUser?.uid ?? "");

		if (!playerId || playerId === currentUserId) {
			return;
		}

		set((state) => {
			const alreadyInvited = state.invitedPlayers.some((item) => item.id === playerId);

			if (alreadyInvited) {
				return {
					invitedPlayers: state.invitedPlayers.filter((item) => item.id !== playerId),
				};
			}

			return {
				invitedPlayers: [...state.invitedPlayers, mapUserToMatchPlayer(player)],
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
				id: currentUserId,
				uid: currentUser.uid,
				name:
					currentUser.name ||
					`${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				picture: currentUser.picture,
				gtr: Number(currentUser.utr) || 0,
			},
			invitedPlayers,
		};

		try {
			set({ isSubmitting: true });
			await createMatch(payload);
		} catch (error) {
			console.error("Error creating match:", error);
		} finally {
			set({ isSubmitting: false });
		}
	},
}));
