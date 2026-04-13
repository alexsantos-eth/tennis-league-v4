import { useMemo } from "react";
import type { User } from "@/types/users";

export const getInitials = (name?: string) => {
  const [first = "", second = ""] = name?.trim().split(" ") || [];
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || "PL";
};

export const formatGtr = (value: number) => {
  if (!Number.isFinite(value)) {
    return "Sin ranking";
  }

  return value > 0 ? Number(value).toFixed(2) : "Sin ranking";
};

export const useFilteredPlayers = (
  availablePlayers: User[],
  friendPlayerIds: string[],
  playersTab: "Amigos" | "Global",
  playersSearch: string,
) => {
  return useMemo(() => {
    const normalizedQuery = playersSearch.trim().toLowerCase();

    const scopedPlayers =
      playersTab === "Amigos"
        ? availablePlayers.filter((player) =>
            friendPlayerIds.includes(String(player.uid ?? ""))
          )
        : availablePlayers;

    if (!normalizedQuery) {
      return scopedPlayers;
    }

    return scopedPlayers.filter((player) => {
      const name = (
        player.name || `${player.firstName ?? ""} ${player.lastName ?? ""}`
      ).toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        String(player.uid ?? "").includes(normalizedQuery)
      );
    });
  }, [availablePlayers, friendPlayerIds, playersTab, playersSearch]);
};

export const getPlayerDisplayName = (player: User): string => {
  return (
    player.name ||
    `${player.firstName ?? ""} ${player.lastName ?? ""}`.trim() ||
    "Jugador sin nombre"
  );
};
