import {
  CheckCheckIcon,
  InfoIcon,
  LoaderIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import {
  createMatchScoreAppeal,
  getMatchById,
  resolveMatchScoreAppeal,
  submitMatchScoreConfirmation,
} from "@/firebase/match";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import MatchScoreSetsCard from "@/views/match/[id]/components/match-score-sets-card";

import type {
  MatchCreatorSummary,
  MatchRecord,
  MatchSetScore,
  SubmitMatchScoreInput,
} from "@/types/match";
interface ConfirmMatchScoreViewProps {
  matchId: string;
}

const DEFAULT_SETS_COUNT = 3;

const getPlayerId = (player: MatchCreatorSummary) =>
  String(player.uid || player.id || "").trim();

const getPlayerName = (player?: MatchCreatorSummary) => {
  const byNames = `${player?.firstName || ""} ${player?.lastName || ""}`.trim();

  if (byNames.length > 0) {
    return byNames;
  }

  return player?.name || "Jugador";
};

const clampSetsCount = (value: number) => {
  const nextValue = Number(value || DEFAULT_SETS_COUNT);

  if (!Number.isFinite(nextValue)) {
    return DEFAULT_SETS_COUNT;
  }

  return Math.min(5, Math.max(1, Math.trunc(nextValue)));
};

const buildEmptySets = (setsCount: number): MatchSetScore[] =>
  Array.from({ length: clampSetsCount(setsCount) }, () => ({
    teamA: 0,
    teamB: 0,
  }));

const buildScoreSignature = (scoreInput: SubmitMatchScoreInput) =>
  `${scoreInput.setsCount}:${scoreInput.sets
    .map((setScore) => `${setScore.teamA}-${setScore.teamB}`)
    .join("|")}`;

const normalizeScoreInput = (
  setsCount: number,
  sets: MatchSetScore[],
): SubmitMatchScoreInput => {
  const normalizedSetsCount = clampSetsCount(setsCount);

  return {
    setsCount: normalizedSetsCount,
    sets: Array.from({ length: normalizedSetsCount }, (_, index) => {
      const currentSet = sets[index];

      return {
        teamA: Math.max(0, Math.trunc(Number(currentSet?.teamA || 0))),
        teamB: Math.max(0, Math.trunc(Number(currentSet?.teamB || 0))),
      };
    }),
  };
};

const ConfirmMatchScoreView: React.FC<ConfirmMatchScoreViewProps> = ({
  matchId,
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [setsCount, setSetsCount] = useState<number>(DEFAULT_SETS_COUNT);
  const [sets, setSets] = useState<MatchSetScore[]>(
    buildEmptySets(DEFAULT_SETS_COUNT),
  );
  const [appealReason, setAppealReason] = useState("");
  const [isSubmittingConfirmation, setIsSubmittingConfirmation] =
    useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [isResolvingAppeal, setIsResolvingAppeal] = useState(false);

  const currentUserId = String(currentUser?.uid || "").trim();

  const loadMatch = useCallback(async () => {
    if (!matchId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      const currentMatch = await getMatchById(matchId);
      setMatch(currentMatch);
    } catch (error) {
      console.error("Error loading match score data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  const players = useMemo(() => {
    if (!match) {
      return [] as MatchCreatorSummary[];
    }

    return [match.createdBy, ...(match.invitedPlayers || [])];
  }, [match]);

  const participantIds = useMemo(
    () => Array.from(new Set(players.map(getPlayerId).filter(Boolean))),
    [players],
  );

  const isParticipant = useMemo(
    () => Boolean(currentUserId && participantIds.includes(currentUserId)),
    [currentUserId, participantIds],
  );

  const ownerId = useMemo(
    () => (match ? getPlayerId(match.createdBy) : ""),
    [match],
  );
  const isMatchOwner = Boolean(
    currentUserId && ownerId && currentUserId === ownerId,
  );

  const confirmations = match?.scoreBoard?.confirmations || {};
  const confirmedCount = participantIds.filter((id) =>
    Boolean(confirmations[id]),
  ).length;

  const confirmationSignatures = useMemo(() => {
    const signatures = participantIds
      .map((participantId) => confirmations[participantId])
      .filter(Boolean)
      .map((confirmation) =>
        buildScoreSignature({
          setsCount: confirmation.setsCount,
          sets: confirmation.sets,
        }),
      );

    return Array.from(new Set(signatures));
  }, [confirmations, participantIds]);

  const hasMismatch = confirmationSignatures.length > 1;
  const appeal = match?.scoreBoard?.appeal;
  const hasPendingAppeal = appeal?.status === "pending";
  const ownConfirmation =
    currentUserId && match?.scoreBoard?.confirmations
      ? match.scoreBoard.confirmations[currentUserId]
      : undefined;

  useEffect(() => {
    if (!match || !currentUserId) {
      return;
    }

    const fallbackScore = ownConfirmation || match.scoreBoard?.finalScore;

    if (!fallbackScore) {
      return;
    }

    setSetsCount(fallbackScore.setsCount);
    setSets(
      Array.from({ length: fallbackScore.setsCount }, (_, index) => ({
        teamA: Number(fallbackScore.sets[index]?.teamA || 0),
        teamB: Number(fallbackScore.sets[index]?.teamB || 0),
      })),
    );
  }, [currentUserId, match, ownConfirmation]);

  const onChangeSetsCount = (nextCount: number) => {
    const normalizedCount = clampSetsCount(nextCount);

    setSetsCount(normalizedCount);
    setSets((currentSets) =>
      Array.from({ length: normalizedCount }, (_, index) => ({
        teamA: Number(currentSets[index]?.teamA || 0),
        teamB: Number(currentSets[index]?.teamB || 0),
      })),
    );
  };

  const onChangeSetScore = (
    setIndex: number,
    side: "teamA" | "teamB",
    value: string,
  ) => {
    setSets((currentSets) =>
      currentSets.map((setScore, currentIndex) => {
        if (currentIndex !== setIndex) {
          return setScore;
        }

        const parsedValue = Math.max(0, Math.trunc(Number(value || 0)));

        return {
          ...setScore,
          [side]: Number.isFinite(parsedValue) ? parsedValue : 0,
        };
      }),
    );
  };

  const submitConfirmation = async () => {
    if (!match || !currentUserId) {
      return;
    }

    try {
      setIsSubmittingConfirmation(true);

      await submitMatchScoreConfirmation(
        match.id || matchId,
        currentUserId,
        normalizeScoreInput(setsCount, sets),
      );

      toast.success("Resultado confirmado. Esperando el resto de jugadores.");
      await loadMatch();
    } catch (error) {
      console.error("Error confirming score:", error);
      toast.error("No se pudo confirmar el resultado.");
    } finally {
      setIsSubmittingConfirmation(false);
    }
  };

  const submitAppeal = async () => {
    if (!match || !currentUserId) {
      return;
    }

    try {
      setIsSubmittingAppeal(true);

      await createMatchScoreAppeal(match.id || matchId, currentUserId, {
        reason: appealReason,
        proposedScore: normalizeScoreInput(setsCount, sets),
      });

      setAppealReason("");
      toast.success("Apelación enviada. Esperando decisión del creador.");
      await loadMatch();
    } catch (error) {
      console.error("Error creating appeal:", error);
      toast.error("No se pudo crear la apelación.");
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  const resolveAppeal = async (decision: "accepted" | "rejected") => {
    if (!match || !currentUserId) {
      return;
    }

    try {
      setIsResolvingAppeal(true);

      await resolveMatchScoreAppeal(
        match.id || matchId,
        currentUserId,
        decision,
      );

      toast.success(
        decision === "accepted"
          ? "Apelación aceptada. Partido finalizado."
          : "Apelación rechazada.",
      );
      await loadMatch();
    } catch (error) {
      console.error("Error resolving appeal:", error);
      toast.error("No se pudo resolver la apelación.");
    } finally {
      setIsResolvingAppeal(false);
    }
  };

  if (isLoading) {
    return (
      <Stack>
        <Alert>
          <LoaderIcon />
          <AlertDescription>
            Cargando confirmación de partido...
          </AlertDescription>
        </Alert>
      </Stack>
    );
  }

  if (hasError) {
    return (
      <Stack>
        <Alert>
          <InfoIcon />
          <AlertDescription>
            No pudimos cargar los datos del partido.
          </AlertDescription>
        </Alert>
      </Stack>
    );
  }

  if (!match) {
    return (
      <Stack>
        <Alert>
          <InfoIcon />
          <AlertDescription>Partido no encontrado.</AlertDescription>
        </Alert>
      </Stack>
    );
  }

  if (!isParticipant) {
    return (
      <Stack>
        <Alert>
          <InfoIcon />
          <AlertDescription>
            Solo los jugadores de este partido pueden confirmar resultados.
          </AlertDescription>
        </Alert>
      </Stack>
    );
  }

  const confirmButtonDisabled =
    isSubmittingConfirmation ||
    hasPendingAppeal ||
    match.status === "finished" ||
    Boolean(ownConfirmation);

  const isFinalScoreAvailable = Boolean(
    match.status === "finished" && match.scoreBoard?.finalScore,
  );
  const displayedSetsCount = isFinalScoreAvailable
    ? match.scoreBoard!.finalScore!.setsCount
    : setsCount;
  const displayedSets = isFinalScoreAvailable
    ? match.scoreBoard!.finalScore!.sets
    : sets;

  return (
    <Stack className="h-full overflow-y-auto py-6 bg-muted">
      <BoxContainer
        className="gap-4"
        title="Confirmación de resultados"
        description="Deben confirmar exactamente el mismo resultado para finalizar el partido."
      >
        <div className="text-sm text-muted-foreground">
          Confirmaciones:{" "}
          <span className="font-semibold text-foreground">
            {confirmedCount}/{participantIds.length}
          </span>
        </div>

        <div className="grid gap-4">
          {players.map((player) => {
            const playerId = getPlayerId(player);
            const isConfirmed = Boolean(confirmations[playerId]);

            return (
              <BoxContainer
                key={playerId}
                className="border flex justify-between rounded-lg"
              >
                <Text variant="bodySmall">{getPlayerName(player)}</Text>
                <Text
                  variant="bodySmall"
                  className={
                    isConfirmed ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {isConfirmed ? "Confirmado" : "Pendiente"}
                </Text>
              </BoxContainer>
            );
          })}
        </div>

        {ownConfirmation && !isFinalScoreAvailable && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-2">
            <Text variant="bodySmall" className="font-semibold">
              Tu resultado enviado
            </Text>
            <div className="mt-2 flex flex-wrap gap-2">
              {ownConfirmation.sets.map((setScore, index) => (
                <Text
                  variant="bodySmall"
                  key={`own-confirmed-set-${index + 1}`}
                  className="rounded-md border border-border px-2 py-1 text-foreground"
                >
                  <b>Set {index + 1}</b>: {setScore.teamA} - {setScore.teamB}
                </Text>
              ))}
            </div>
          </div>
        )}
      </BoxContainer>

      <MatchScoreSetsCard
        title="Cantidad de sets"
        description={isFinalScoreAvailable ? "Resultado final" : undefined}
        setsCount={displayedSetsCount}
        sets={displayedSets}
        players={players}
        currentUserUid={currentUserId}
        isReadOnly={isFinalScoreAvailable}
        onChangeSetsCount={onChangeSetsCount}
        onChangeSetScore={onChangeSetScore}
      />

      {hasMismatch && !appeal && match.status !== "finished" && (
        <BoxContainer
          className="gap-4"
          title="Crear apelación"
          description="Se detectaron resultados diferentes. Solo se permite una apelación por partido."
        >
          <Textarea
            value={appealReason}
            onChange={(event) => setAppealReason(event.target.value)}
            placeholder="Describe por qué el resultado no coincide"
          />

          <Button
            type="button"
            variant="secondary"
            onClick={submitAppeal}
            disabled={isSubmittingAppeal || !appealReason.trim()}
          >
            {isSubmittingAppeal ? "Enviando apelación..." : "Enviar apelación"}
          </Button>
        </BoxContainer>
      )}

      {appeal && (
        <BoxContainer className="gap-4" title="Estado de apelación">
          <div className="text-sm text-muted-foreground">
            Estado:{" "}
            <span className="font-semibold text-foreground">
              {appeal.status}
            </span>
          </div>
          <p className="text-sm text-foreground">{appeal.reason}</p>

          <div className="text-sm text-muted-foreground">
            Resultado propuesto:{" "}
            {appeal.proposedScore.sets
              .map(
                (setScore, index) =>
                  `Set ${index + 1} (${setScore.teamA}-${setScore.teamB})`,
              )
              .join(" · ")}
          </div>

          {hasPendingAppeal && isMatchOwner && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => resolveAppeal("accepted")}
                disabled={isResolvingAppeal}
              >
                Aceptar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => resolveAppeal("rejected")}
                disabled={isResolvingAppeal}
              >
                Rechazar
              </Button>
            </div>
          )}
        </BoxContainer>
      )}

      <Button
        type="button"
        size="lg"
        className="h-12 rounded-2xl text-base font-semibold"
        onClick={submitConfirmation}
        disabled={confirmButtonDisabled}
        variant={confirmButtonDisabled ? "secondary" : "default"}
      >
        {isSubmittingConfirmation ? <LoaderIcon /> : <CheckCheckIcon />}

        {ownConfirmation
          ? "Resultado enviado"
          : isSubmittingConfirmation
            ? "Confirmando..."
            : "Confirmar resultado"}
      </Button>
    </Stack>
  );
};

export default ConfirmMatchScoreView;
