import type { FC } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import MatchButtonRow from "@/views/match/new/client/components/match-button-row";

import type { KycAnswers, KycQuestion } from "@/types/kyc";
import ActionButton from "@/components/ui/action-button";
interface QuestionsStepProps {
  question: KycQuestion;
  answers: KycAnswers;
  questionIndex: number;
  totalQuestions: number;
  progress: number;
  onBack: () => void;
  onAnswer: (name: string) => (value: string) => Promise<void>;
}

const QuestionsStep: FC<QuestionsStepProps> = ({
  question,
  answers,
  questionIndex,
  totalQuestions,
  progress,
  onBack,
  onAnswer,
}) => {
  const Icon = question.icon;

  return (
    <Stack noPx>
      <BoxContainer title="Paso 2 de 2">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <Text variant="body" className="font-semibold">
                Cuentanos tu nivel de tenis
              </Text>
              <Text variant="bodySmall" className="text-muted-foreground">
                Pregunta {questionIndex + 1} de {totalQuestions}
              </Text>
            </div>

            <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Text variant="body" className="font-medium">
              {question.title}
            </Text>
            <Text variant="bodySmall" className="text-muted-foreground">
              {question.description}
            </Text>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70">
            {question.options.map((option) => {
              const isActive = answers[question.name] === option.value;

              return (
                <MatchButtonRow
                  key={`${question.name}-${option.value}`}
                  onClick={() =>
                    onAnswer(question.name)(option.value.toString())
                  }
                  icon={<span className="text-sm">{option.icon}</span>}
                  title={option.label}
                >
                  {isActive ? (
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                </MatchButtonRow>
              );
            })}
          </div>

          {questionIndex === totalQuestions - 1 && (
            <Text variant="bodyXs" className="text-muted-foreground">
              La siguiente respuesta completa tu registro.
            </Text>
          )}
        </div>
      </BoxContainer>

      <ActionButton
        type="button"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
        Volver
      </ActionButton>
    </Stack>
  );
};

export default QuestionsStep;
