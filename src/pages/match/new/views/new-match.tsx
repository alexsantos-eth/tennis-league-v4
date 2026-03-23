import {
    ArrowRight, Building2, Calendar, CheckCheck, ChevronRight, CircleDotDashed, CircleEqualIcon,
    CircleSlash2Icon, Edit2Icon, Lock, MapPin, PlayIcon, PlusIcon, SlidersHorizontal, UserIcon,
    Users2, UsersIcon
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { es } from 'react-day-picker/locale';
import { Case, Else, If, Switch, Then } from 'react-if';

import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch as SwitchButton } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { Button } from '../../../../components/ui/button';
import BoxContainer from '../../../../components/ui/container';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import Text from '../../../../components/ui/text';
import { createMatch } from '../../../../firebase/match';
import { useAuthStore } from '../../../../store/auth';
import MatchDetailsRow from './components/match-details-row';
import MatchTeamCol from './components/match-team-col';

import type {
  CreateMatchInput,
  PublicMatchFormat,
  PublicMatchSport,
  PublicMatchType,
} from "../../../../types/match";
const sports: PublicMatchSport[] = ["Tenis", "Padel", "Pickleball"];
const matchTypes: PublicMatchType[] = ["Doubles", "Singles"];
const matchFormats: PublicMatchFormat[] = ["Ranking", "Friendly"];
const popularClubs = [
  "Federacion z15",
  "Club Delfines",
  "Camino Real",
  "Sporta",
];

const rangeFloor = 0;
const rangeCeiling = 10;
const rangeStep = 1;

const getClosestHalfHourTime = (date: Date = new Date()) => {
  const minutesInDay = 24 * 60;
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const roundedMinutes = Math.round(totalMinutes / 30) * 30;
  const normalizedMinutes = roundedMinutes % minutesInDay;
  const hour = Math.floor(normalizedMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (normalizedMinutes % 60).toString().padStart(2, "0");

  return `${hour}:${minute}`;
};

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const totalMinutes = index * 30;
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hour}:${minute}`;
});

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
  const [matchTime, setMatchTime] = useState(() => getClosestHalfHourTime());
  const [rangeMin, setRangeMin] = useState(2);
  const [rangeMax, setRangeMax] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(
    matchDate ? new Date(matchDate) : undefined,
  );
  const [tempLocation, setTempLocation] = useState("");

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
      const dateString = tempDate.toLocaleDateString("es-ES", {
        month: "2-digit",
        day: "2-digit",
      });
      setMatchDate(dateString);
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

  return (
    <>
      <form
        className="w-full flex flex-col pb-8 gap-6 overflow-scroll h-full"
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

          <BoxContainer className="grid grid-cols-[1fr_auto_1fr] justify-center items-center py-6">
            <MatchTeamCol title="Equipo A" />
            <div className="w-full flex flex-col items-center pt-8">
              <div className="bg-primary h-9 w-9 flex items-center rounded-full justify-center">
                <Text variant="body">vs</Text>
              </div>
            </div>
            <MatchTeamCol title="Equipo B" />
          </BoxContainer>

          <BoxContainer>
            <MatchDetailsRow
              title="Fecha y hora"
              icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            >
              <If condition={Boolean(matchDate)}>
                <Then>
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleOpenDateSheet()}
                  >
                    <Text variant="body" className="text-foreground text-right">
                      {matchDate} {matchTime && `- ${matchTime}`}
                    </Text>
                    <Button size="icon-sm" variant="ghost">
                      <Edit2Icon />
                    </Button>
                  </div>
                </Then>
                <Else>
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full bg-muted text-foreground"
                    onClick={() => handleOpenDateSheet()}
                  >
                    <PlusIcon />
                  </Button>
                </Else>
              </If>
            </MatchDetailsRow>
          </BoxContainer>

          <BoxContainer className="flex flex-col gap-4">
            <MatchDetailsRow
              title="Ubicacion"
              icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
            >
              <If condition={Boolean(location)}>
                <Then>
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleOpenLocationSheet()}
                  >
                    <Text variant="body" className="text-foreground text-right">
                      {location}
                    </Text>
                    <Button size="icon-sm" variant="ghost">
                      <Edit2Icon />
                    </Button>
                  </div>
                </Then>
                <Else>
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full bg-muted text-foreground"
                    onClick={() => handleOpenLocationSheet()}
                  >
                    <PlusIcon />
                  </Button>
                </Else>
              </If>
            </MatchDetailsRow>
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

      <Sheet open={isDateSheetOpen} onOpenChange={setIsDateSheetOpen}>
        <SheetContent side="bottom" aria-describedby="date-sheet-description">
          <SheetHeader className="flex-row justify-between items-center">
            <SheetTitle>Selecciona una fecha</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center w-full px-6 gap-6">
            <CalendarComponent
              locale={es}
              className="w-full max-w-90"
              mode="single"
              selected={tempDate}
              captionLayout="dropdown"
              onSelect={setTempDate}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />

            <Select value={matchTime} onValueChange={setMatchTime}>
              <BoxContainer title="Selecciona una hora" className="p-0 w-full">
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
              </BoxContainer>

              <SelectContent className="max-w-25">
                <SelectGroup>
                  {timeOptions.map((time) => (
                    <SelectItem className="text-lg" key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter>
            <Button
              size="lg"
              type="button"
              onClick={handleConfirmDate}
              className="flex-1 rounded-xl"
              disabled={!tempDate}
            >
              <CheckCheck />
              Confirmar
            </Button>

            <SheetClose className="w-full" asChild>
              <Button
                size="lg"
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl w-full"
              >
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isLocationSheetOpen} onOpenChange={setIsLocationSheetOpen}>
        <SheetContent
          side="bottom"
          aria-describedby="location-sheet-description"
        >
          <SheetHeader>
            <SheetTitle>Selecciona una ubicacion</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-6 pb-6">
            <BoxContainer
              title="Clubes mas populares"
              className="p-0 overflow-hidden border border-border"
            >
              {popularClubs.map((club) => (
                <button
                  key={club}
                  type="button"
                  className="w-full px-4 py-4 flex items-center gap-3 border-b border-border/70 last:border-b-0"
                  onClick={() => setTempLocation(club)}
                >
                  <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </span>

                  <Text
                    variant="bodySmall"
                    className="flex-1 text-left text-base font-medium text-foreground"
                  >
                    {club}
                  </Text>

                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              ))}
            </BoxContainer>

            <BoxContainer
              className="overflow-hidden border border-border flex gap-4"
              onClick={() => setTempLocation("")}
            >
              <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </span>

              <div>
                <Text
                  variant="bodySmall"
                  className="text-base font-medium text-foreground"
                >
                  Otro club o cancha privada
                </Text>
                <Text
                  variant="bodySmall"
                  className="text-sm text-muted-foreground max-w-50"
                >
                  Cancha de tu condominio, club exclusivo y mas.
                </Text>
              </div>
            </BoxContainer>

            <div className="flex items-center gap-4">
              <Input
                type="text"
                value={tempLocation}
                onChange={(event) => setTempLocation(event.target.value)}
                placeholder="Nombre del club o cancha"
              />

              <Button
                type="button"
                size="icon-lg"
                className="h-10 w-10 rounded-xl"
                onClick={handleConfirmLocation}
                disabled={!tempLocation.trim()}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
