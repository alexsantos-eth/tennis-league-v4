import {
  Calendar,
  CircleDotDashed,
  CircleEqualIcon,
  CircleSlash2Icon,
  Clock,
  Lock,
  MapPin,
  PlayIcon,
  SlidersHorizontal,
  UserIcon,
  Users2,
  UsersIcon,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { If, Then, Switch, Case } from "react-if";

import { Button } from "../../../../components/ui/button";
import BoxContainer from "../../../../components/ui/container";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import Text from "../../../../components/ui/text";
import { createMatch } from "../../../../firebase/match";
import { useAuthStore } from "../../../../store/auth";

import type {
  CreateMatchInput,
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../../../../types/match";
import { Textarea } from "@/components/ui/textarea";
import { Switch as SwitchButton } from "@/components/ui/switch";
import MatchDetailsRow from "./components/match-details-row";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(6);
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

  return (
    <>
      <form
        className="w-full flex flex-col pb-24 gap-6 overflow-scroll h-full"
        onSubmit={handleSubmit}
      >
        <Tabs defaultValue={sport} className="bg-background w-full px-6 py-5">
          <TabsList variant="default" className="w-full">
            {sports.map((item: string) => {
              return (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="h-8"
                  onClick={() => setSport(item as PublicMatchSport)}
                >
                  <Switch>
                    <Case condition={item === "Tenis"}>
                      <CircleSlash2Icon />
                    </Case>

                    <Case condition={item === "Padel"}>
                      <CircleEqualIcon />
                    </Case>

                    <Case condition={item === "Pickleball"}>
                      <CircleDotDashed />
                    </Case>
                  </Switch>

                  {item}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="w-full flex flex-col gap-6 px-6">
          <BoxContainer title="Tipo de partido" className="p-2">
            <Tabs defaultValue={matchType} className="bg-background w-full">
              <TabsList variant="default" className="w-full p-0">
                {matchTypes.map((item: string) => {
                  return (
                    <TabsTrigger
                      key={item}
                      value={item}
                      className="h-8"
                      onClick={() => setMatchType(item as PublicMatchType)}
                    >
                      <Switch>
                        <Case condition={item === "Doubles"}>
                          <UsersIcon />
                        </Case>

                        <Case condition={item === "Singles"}>
                          <UserIcon />
                        </Case>
                      </Switch>

                      {item}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
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
              <Text variant="body" className="text-foreground font-medium">
                GTR
              </Text>
              <Text variant="body" className="text-primary font-semibold">
                {rangeMin} - {rangeMax}
              </Text>
            </div>

            <Slider
              defaultValue={[rangeMin, rangeMax]}
              max={10}
              min={1}
              step={1}
              onValueChange={(ev) => {
                const [min, max] = ev;

                handleMinRangeChange(min);
                handleMaxRangeChange(max);
              }}
            />
          </BoxContainer>

          <BoxContainer
            className="flex flex-col gap-4"
            title="Detalles de partido"
          >
            <MatchDetailsRow
              title="Tipo"
              icon={<Users2 className="w-4 h-4 text-muted-foreground" />}
            >
              <Select defaultValue={matchFormat}>
                <SelectTrigger className="text-primary font-medium">
                  <SelectValue className="text-primary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {matchFormats.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        onClick={() => setMatchFormat(item)}
                      >
                        <Switch>
                          <Case condition={item === "Ranking"}>
                            Competitivo
                          </Case>

                          <Case condition={item === "Friendly"}>Amistoso</Case>
                        </Switch>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </MatchDetailsRow>

            <MatchDetailsRow
              icon={
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              }
              title="Marcar como reservado"
            >
              <SwitchButton
                size="lg"
                checked={isReserved}
                onClick={() => setIsReserved((prev) => !prev)}
              />
            </MatchDetailsRow>

            <MatchDetailsRow
              icon={<Lock className="w-4 h-4 text-muted-foreground" />}
              title="Partido privado"
            >
              <SwitchButton
                size="lg"
                checked={isPrivate}
                onClick={() => setIsPrivate((prev) => !prev)}
              />
            </MatchDetailsRow>
          </BoxContainer>

          <BoxContainer className="p-0 overflow-hidden" title="Comentarios">
            <Textarea
              value={comments}
              className="rounded-2xl p-4"
              placeholder="Agrega detalles adicionales"
              onChange={(event) => setComments(event.target.value)}
            />
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
