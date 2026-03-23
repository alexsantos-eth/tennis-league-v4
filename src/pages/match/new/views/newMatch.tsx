import BoxContainer from "../../../../components/ui/container";
import Text from "../../../../components/ui/text";
import { Button } from "../../../../components/ui/button";
import { createMatch } from "../../../../firebase/match";

import { useAuthStore } from "../../../../store/auth";
import {
  Calendar,
  Clock,
  Lock,
  MapPin,
  PlayIcon,
  SlidersHorizontal,
  Users2,
} from "lucide-react";

import { type FormEvent, useState } from "react";

import type {
  CreateMatchInput,
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../../../../types/match";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

const sports: PublicMatchSport[] = ["Tenis", "Padel", "Pickleball"];
const matchTypes: PublicMatchType[] = ["Doubles", "Singles"];
const matchFormats: PublicMatchFormat[] = ["Ranking", "Friendly"];

const rangeFloor = 0;
const rangeCeiling = 10;
const rangeStep = 1;

export default function NewMatchPage() {
  const { currentUser } = useAuthStore();
  const [sport, setSport] = useState<PublicMatchSport>("Tenis");
  const [matchType, setMatchType] = useState<PublicMatchType>("Doubles");
  const [matchFormat, setMatchFormat] = useState<PublicMatchFormat>("Ranking");
  const [isReserved, setIsReserved] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [comments, setComments] = useState("");
  const [location, setLocation] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [rangeMin, setRangeMin] = useState(1);
  const [rangeMax, setRangeMax] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMinRangeChange = (value: number) => {
    setRangeMin(Math.min(value, rangeMax - rangeStep));
  };

  const handleMaxRangeChange = (value: number) => {
    setRangeMax(Math.max(value, rangeMin + rangeStep));
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

  console.log("Current user:", sport);

  return (
    <>
      <Tabs  defaultValue={sport}>
        <TabsList variant="default">
          {sports.map((item: string) => {
            const isActive = sport === item;

            return (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <form
        className="w-full flex flex-col pb-24 gap-6 overflow-scroll h-full"
        onSubmit={handleSubmit}
      >
        <BoxContainer className="flex items-center gap-2 rounded-none px-6">
          <div>
            {sports.map((item) => {
              const isActive = sport === item;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className="flex-1 h-9 rounded-lg"
                  onClick={() => setSport(item)}
                >
                  {item}
                </Button>
              );
            })}
          </div>
        </BoxContainer>

        <div className="w-full flex flex-col gap-6 px-6">
          <BoxContainer
            className="flex items-center gap-2"
            title="Tipo de partido"
          >
            {matchTypes.map((item) => {
              const isActive = matchType === item;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className="flex-1 h-10 rounded-lg"
                  onClick={() => setMatchType(item)}
                >
                  {item}
                </Button>
              );
            })}
          </BoxContainer>

          <BoxContainer className="flex flex-col gap-4" title="Lugar">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="flex-1 flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Fecha
                </span>
                <input
                  type="date"
                  value={matchDate}
                  onChange={(event) => setMatchDate(event.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none"
                  required
                />
              </label>

              <label className="flex-1 flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Hora
                </span>
                <input
                  type="time"
                  value={matchTime}
                  onChange={(event) => setMatchTime(event.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none"
                  required
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Ubicacion
              </span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Club, direccion o referencia"
                required
              />
            </label>
          </BoxContainer>

          <BoxContainer className="flex flex-col gap-5" title="Rango permitido">
            <div className="flex items-center justify-between">
              <Text variant="body" className="text-foreground font-semibold">
                GTR
              </Text>
              <Text variant="body" className="text-primary font-semibold">
                {rangeMin} - {rangeMax}
              </Text>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">
                Minimo
              </span>
              <input
                type="range"
                min={rangeFloor}
                max={rangeCeiling}
                step={rangeStep}
                value={rangeMin}
                onChange={(event) =>
                  handleMinRangeChange(Number(event.target.value))
                }
                className="w-full accent-primary"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">
                Maximo
              </span>
              <input
                type="range"
                min={rangeFloor}
                max={rangeCeiling}
                step={rangeStep}
                value={rangeMax}
                onChange={(event) =>
                  handleMaxRangeChange(Number(event.target.value))
                }
                className="w-full accent-primary"
              />
            </label>
          </BoxContainer>

          <BoxContainer
            className="flex flex-col gap-4"
            title="Detalles de partido"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-muted-foreground" />
                <Text variant="body" className="text-foreground font-semibold">
                  Tipo
                </Text>
              </div>

              <div className="flex items-center gap-2">
                {matchFormats.map((item) => {
                  const isActive = matchFormat === item;

                  return (
                    <Button
                      key={item}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      className="flex-1 h-10 rounded-lg"
                      onClick={() => setMatchFormat(item)}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <Text variant="body" className="text-foreground font-semibold">
                  Marcar como reservado
                </Text>
              </div>
              <button
                type="button"
                className={`h-6 w-11 rounded-full transition-colors ${isReserved ? "bg-primary" : "bg-muted"}`}
                onClick={() => setIsReserved((prev) => !prev)}
                aria-pressed={isReserved}
                aria-label="Marcar como reservado"
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                    isReserved ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <Text variant="body" className="text-foreground font-semibold">
                  Partido privado
                </Text>
              </div>
              <button
                type="button"
                className={`h-6 w-11 rounded-full transition-colors ${isPrivate ? "bg-primary" : "bg-muted"}`}
                onClick={() => setIsPrivate((prev) => !prev)}
                aria-pressed={isPrivate}
                aria-label="Partido privado"
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                    isPrivate ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </BoxContainer>

          <BoxContainer className="p-0 overflow-hidden" title="Comentarios">
            <label className="flex flex-col gap-2 p-4">
              <textarea
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                className="w-full min-h-24 resize-none bg-card text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Comentarios sobre el partido (opcional)"
              />
            </label>
          </BoxContainer>

          <Button
            type="submit"
            className="h-12 rounded-2xl text-base font-semibold"
            disabled={isSubmitting}
          >
            <PlayIcon />
            {isSubmitting ? "Creando partido..." : "Crear partido"}
          </Button>
        </div>
      </form>
    </>
  );
}
