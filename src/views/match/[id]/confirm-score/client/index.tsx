import { CheckCheckIcon, InfoIcon, LoaderIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import MatchScoreSetsCard from "@/views/match/[id]/components/match-score-sets-card";

import useScoreEvents from "./hooks/useScoreEvents";
import { getPlayerId, getPlayerName } from "./tools/sets";

interface ConfirmMatchScoreViewProps {
  matchId: string;
}

const ConfirmMatchScoreView: React.FC<ConfirmMatchScoreViewProps> = ({
  matchId,
}) => {
  const {
    isLoading,
    hasError,
    match,
    players,
    appealReason,
    isSubmittingConfirmation,
    isSubmittingAppeal,
    isResolvingAppeal,
    ownConfirmation,
    confirmations,
    isFinalScoreAvailable,
    displayedSetsCount,
    displayedSets,
    hasMismatch,
    appeal,
    hasPendingAppeal,
    isMatchOwner,
    submitConfirmation,
    onChangeSetsCount,
    onChangeSetScore,
    submitAppeal,
    isParticipant,
    confirmedCount,
    participantIds,
    resolveAppeal,
    confirmButtonDisabled,
    currentUserId,
    setAppealReason,
  } = useScoreEvents({ matchId });

  if (isLoading) {
    return (
      <Stack className="py-6">
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
      <Stack className="py-6">
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
      <Stack className="py-6">
        <Alert>
          <InfoIcon />
          <AlertDescription>Partido no encontrado.</AlertDescription>
        </Alert>
      </Stack>
    );
  }

  if (!isParticipant) {
    return (
      <Stack className="py-6">
        <Alert>
          <InfoIcon />
          <AlertDescription>
            Solo los jugadores de este partido pueden confirmar resultados.
          </AlertDescription>
        </Alert>
      </Stack>
    );
  }

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
          <BoxContainer className="rounded-xl border border-primary/30 bg-primary/5">
            <Text variant="bodySmall" className="font-semibold">
              Tu resultado enviado:
            </Text>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {ownConfirmation.sets.map((setScore, index) => (
                <BoxContainer
                  className="border border-border rounded-lg p-2"
                  key={`own-confirmed-set-${index + 1}`}
                >
                  <Text
                    variant="bodySmall"
                    className="text-foreground text-center"
                  >
                    <b>Set {index + 1}</b>
                  </Text>

                  <Text variant="bodySmall" className="text-center">
                    {setScore.teamA} - {setScore.teamB}
                  </Text>
                </BoxContainer>
              ))}
            </div>
          </BoxContainer>
        )}
      </BoxContainer>

      {(!ownConfirmation || isFinalScoreAvailable) && (
        <MatchScoreSetsCard
          title="Cantidad de sets"
          description={isFinalScoreAvailable ? "Resultado final" : undefined}
          setsCount={displayedSetsCount || 0}
          sets={displayedSets || []}
          players={players}
          currentUserUid={currentUserId}
          isReadOnly={isFinalScoreAvailable}
          onChangeSetsCount={onChangeSetsCount}
          onChangeSetScore={onChangeSetScore}
        />
      )}

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
