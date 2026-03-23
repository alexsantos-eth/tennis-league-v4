import { InfoIcon } from "lucide-react";
import { If, Then } from "react-if";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import useMatches from "../hooks/useMatches";
import MatchCard from "./match-card";
import WeekPick from "./week-pick";

import type { MatchRecord } from "../../../types/match";
import { getDateKey } from "../../../lib/dates";

const Matches = () => {
  const { matches, selectedDate, setSelectedDate, isLoading, hasError } =
    useMatches();

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
        <If condition={!isLoading && !hasError}>
          <Then>
            {filteredMatches.map((match) => (
              <a key={match.id} href={`/match/${match.id}`}>
                <MatchCard
                  time={match.timeOfMatch}
                  type={match.matchType}
                  format={match.matchFormat}
                  category={`${match.sport} · ${match.location}`}
                  status={getStatusLabel(match)}
                  playerOne={{
                    name: match.createdBy.firstName || "",
                    gtr: match.createdBy.gtr.toFixed(2),
                  }}
                  playerTwo={{
                    name: match.isPrivate ? "Privado" : "Pendiente",
                    gtr: `${match.skillRange.min.toFixed(2)}`,
                    detailLabel: "GTR",
                  }}
                />
              </a>
            ))}
          </Then>
        </If>

        <If condition={isLoading}>
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>Cargando partidos...</AlertDescription>
            </Alert>
          </Then>
        </If>

        <If condition={!isLoading && hasError}>
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                No se pudieron cargar los partidos creados.
              </AlertDescription>
            </Alert>
          </Then>
        </If>

        <If condition={!isLoading && !hasError && matches.length === 0}>
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>Aun no hay partidos creados.</AlertDescription>
            </Alert>
          </Then>
        </If>

        <If
          condition={
            !isLoading &&
            !hasError &&
            matches.length > 0 &&
            filteredMatches.length === 0
          }
        >
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                No hay partidos para la fecha seleccionada.
              </AlertDescription>
            </Alert>
          </Then>
        </If>
      </div>
    </div>
  );
};

export default Matches;
