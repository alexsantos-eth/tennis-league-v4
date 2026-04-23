import { useState } from "react";

import { calculateKycScore, KYC_QUESTIONS } from "../tools/questions";

import type { KycAnswers } from "@/types/kyc";
interface UseHandleAnswerProps {
  onComplete: (answers: KycAnswers, totalUtr: number) => Promise<void> | void;
}

const useHandleAnswer = ({ onComplete }: UseHandleAnswerProps) => {
  const [answers, setAnswers] = useState<KycAnswers>({});
  const [questionIndex, setQuestionIndex] = useState(0);

  const question = KYC_QUESTIONS[questionIndex];
  const totalQuestions = KYC_QUESTIONS.length;
  const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  const handler = (name: string) => async (value: string) => {
    const nextAnswers = {
      ...answers,
      [name]: Number(value),
    };

    setAnswers(nextAnswers);

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((currentQuestionIndex) => currentQuestionIndex + 1);
      return;
    }

    await onComplete(nextAnswers, calculateKycScore(nextAnswers));
  };

  const goBack = () => {
    setQuestionIndex((currentQuestionIndex) =>
      Math.max(currentQuestionIndex - 1, 0),
    );
  };

  const reset = () => {
    setAnswers({});
    setQuestionIndex(0);
  };

  return {
    handler,
    question,
    answers,
    questionIndex,
    progress,
    totalQuestions,
    goBack,
    reset,
  };
};

export default useHandleAnswer;
