import { useEffect, useState } from "react";

import MatchCard from "./match-card";
import WeekPick from "./week-pick";
import type { MatchRecord } from "../../../types/match";
import { getRecentMatches } from "../../../firebase/match";

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Matches = () => {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const nextMatches = await getRecentMatches();

        if (!isMounted) {
          return;
        }

        setMatches(nextMatches);
      } catch (error) {
        console.error("Error loading created matches:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusLabel = (match: MatchRecord) =>
    match.isReserved ? "Reservado" : "Abierto";
  const selectedDateKey = getDateKey(selectedDate);
  const filteredMatches = matches.filter((match) => {
    const matchDateKey = match.dateOfMatch.split("T")[0];
    return matchDateKey === selectedDateKey;
  });

  return (
    <div className="flex flex-col gap-6">
      <WeekPick selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="flex flex-col gap-6 px-6">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Cargando partidos...
          </div>
        ) : null}

        {!isLoading && hasError ? (
          <div className="rounded-2xl border border-destructive/20 bg-card p-4 text-sm text-destructive">
            No se pudieron cargar los partidos creados.
          </div>
        ) : null}

        {!isLoading && !hasError && matches.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Aun no hay partidos creados.
          </div>
        ) : null}

        {!isLoading &&
        !hasError &&
        matches.length > 0 &&
        filteredMatches.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            No hay partidos para la fecha seleccionada.
          </div>
        ) : null}

        {!isLoading && !hasError
          ? filteredMatches.map((match) => (
              <a key={match.id} href={`/match/${match.id}`}>
                <MatchCard
                  time={match.timeOfMatch}
                  format={`${match.matchType} · ${match.matchFormat}`}
                  category={`${match.sport} · ${match.location}`}
                  status={getStatusLabel(match)}
                  playerOne={{
                    name: match.createdBy.name,
                    gtr: String(match.createdBy.gtr),
                  }}
                  playerTwo={{
                    name: match.isPrivate ? "Privado" : "Pendiente",
                    gtr: `${match.skillRange.min}`,
                    detailLabel: "GTR",
                  }}
                />
              </a>
            ))
          : null}
      </div>
    </div>
  );
};

export default Matches;
