import { type FormEvent, useMemo, useState } from "react";

import { createMatch } from "../../../../../firebase/match";
import { useAuthStore } from "../../../../../store/auth";
import type {
  CreateMatchInput,
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../../../../../types/match";
import { rangeStep } from "../contants";
import {
  buildHalfHourTimeOptions,
  formatDateForMatch,
  getClosestHalfHourTime,
} from "../tools";

export const useNewMatch = () => {
  const { currentUser } = useAuthStore();

  const [sport, setSport] = useState<PublicMatchSport>("Tenis");
  const [matchType, setMatchType] = useState<PublicMatchType>("Doubles");
  const [matchFormat, setMatchFormat] = useState<PublicMatchFormat>("Ranking");
  const [isReserved, setIsReserved] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [comments, setComments] = useState("");
  const [location, setLocation] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState(() => getClosestHalfHourTime());
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  const [tempLocation, setTempLocation] = useState("");

  const timeOptions = useMemo(() => buildHalfHourTimeOptions(), []);

  const handleMinRangeChange = (value: number) => {
    setRangeMin(Math.min(value, rangeMax - rangeStep));
  };

  const handleMaxRangeChange = (value: number) => {
    setRangeMax(Math.max(value, rangeMin + rangeStep));
  };

  const handleOpenDateSheet = () => {
    setTempDate(matchDate ? new Date(matchDate) : undefined);

    if (!matchTime) {
      setMatchTime(getClosestHalfHourTime());
    }

    setIsDateSheetOpen(true);
  };

  const handleConfirmDate = () => {
    if (tempDate) {
      setMatchDate(formatDateForMatch(tempDate));
    }

    setIsDateSheetOpen(false);
  };

  const handleOpenLocationSheet = () => {
    setTempLocation(location);
    setIsLocationSheetOpen(true);
  };

  const handleConfirmLocation = () => {
    setLocation(tempLocation.trim());
    setIsLocationSheetOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentUserId = String(currentUser?.id ?? currentUser?.uid);

    if (!currentUser || !currentUserId) {
      return;
    }

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
    };

    try {
      setIsSubmitting(true);
      await createMatch(payload);
    } catch (error) {
      console.error("Error creating match:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sport,
    setSport,
    matchType,
    setMatchType,
    matchFormat,
    setMatchFormat,
    isReserved,
    setIsReserved,
    isPrivate,
    setIsPrivate,
    comments,
    setComments,
    location,
    matchDate,
    matchTime,
    setMatchTime,
    rangeMin,
    rangeMax,
    isSubmitting,
    isDateSheetOpen,
    setIsDateSheetOpen,
    isLocationSheetOpen,
    setIsLocationSheetOpen,
    tempDate,
    setTempDate,
    tempLocation,
    setTempLocation,
    timeOptions,
    handleOpenDateSheet,
    handleConfirmDate,
    handleOpenLocationSheet,
    handleConfirmLocation,
    handleMinRangeChange,
    handleMaxRangeChange,
    handleSubmit,
  };
};
