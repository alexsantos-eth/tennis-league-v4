import type { FC } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { KycAnswers, KycQuestion } from "@/views/auth/kyc/client/types";
import { QUESTION_ANIMATION_DELAYS } from "../tools/questions";

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
    <section className="w-full rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl shadow-slate-950/30 backdrop-blur md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
            Paso 2 de 2
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Cuéntanos tu nivel de tenis
          </h2>
        </div>

        <div className="text-right text-sm text-white/60">
          <p>
            Pregunta {questionIndex + 1} de {totalQuestions}
          </p>
          <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon className="size-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold md:text-xl">{question.title}</h3>
            <p className="text-sm text-white/65 md:text-base">{question.description}</p>
          </div>
        </div>

        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isActive = answers[question.name] === option.value;

            return (
              <button
                type="button"
                key={`${question.name}-${option.value}`}
                onClick={() => onAnswer(question.name)(option.value.toString())}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10",
                  QUESTION_ANIMATION_DELAYS[index] ?? "",
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg">
                  {option.icon}
                </span>
                <span className="flex-1 text-sm font-medium md:text-base">{option.label}</span>
                {isActive && <ChevronRight className="size-5 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
            <ArrowLeft className="size-4" />
            Volver
          </Button>

          <p className="text-xs text-white/50">
            La siguiente respuesta completa tu registro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuestionsStep;
