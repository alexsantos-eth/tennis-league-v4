import { CheckCheckIcon, InfoIcon, LoaderIcon, SendIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import MatchScoreSetsCard from "@/views/match/[id]/components/match-score-sets-card";

import useScoreEvents from "./hooks/useScoreEvents";
import { getPlayerId, getPlayerName } from "./tools/sets";
import ActionButton from "@/components/ui/action-button";

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
    <Stack className="py-6">
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

      {hasMismatch &&
        !appeal &&
        match.status !== "finished" &&
        !isMatchOwner && (
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
              size="lg"
              variant="default"
              onClick={submitAppeal}
              disabled={isSubmittingAppeal || !appealReason.trim()}
            >
              <SendIcon />
              {isSubmittingAppeal
                ? "Enviando apelación..."
                : "Enviar apelación"}
            </Button>
          </BoxContainer>
        )}

      {hasMismatch &&
        !appeal &&
        match.status !== "finished" &&
        isMatchOwner && (
          <BoxContainer
            className="gap-4 border border-amber-200 bg-amber-50"
            title="Resultados en conflicto"
          >
            <Text variant="bodySmall">
              Espera a que un participante cree una apelación para resolver el
              conflicto.
            </Text>
          </BoxContainer>
        )}

      {appeal && (
        <BoxContainer className="gap-4" title="Estado de apelación">
          <div className="text-sm text-foreground">
            Estado:{" "}
            <span className="font-semibold text-foreground">
              {(() => {
                if (appeal.status === "pending") return "Pendiente";
                if (appeal.status === "accepted") return "Aceptada";
                if (appeal.status === "rejected") return "Rechazada";
                return appeal.status;
              })()}
            </span>
          </div>

          <p className="text-sm text-foreground">Comentarios: {appeal.reason}</p>

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

      <ActionButton
        type="button"

        onClick={submitConfirmation}
        disabled={confirmButtonDisabled}
      >
        {isSubmittingConfirmation ? <LoaderIcon /> : <CheckCheckIcon />}

        {ownConfirmation
          ? "Resultado enviado"
          : isSubmittingConfirmation
            ? "Confirmando..."
            : "Confirmar resultado"}
      </ActionButton>
    </Stack>
  );
};

export default ConfirmMatchScoreView;
