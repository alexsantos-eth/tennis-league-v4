import { AlertCircle } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { useAuthStore } from "@/store/auth";

import PersonalInfoStep from "./components/kyc-personal-info";
import QuestionsStep from "./components/kyc-questions";
import useHandleAnswer from "./hooks/useKycForm";
import useUserDefaultData from "./hooks/useUserDefaultData";
import { submitKycProfile } from "./tools/submit";

import type { KycAnswers, KycStep } from "@/types/kyc";
const KycView = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const fetchCurrentUserData = useAuthStore(
    (state) => state.fetchCurrentUserData,
  );
  const [step, setStep] = useState<KycStep>("personal-info");
  const [loading, setLoading] = useState(false);
  const personalInfo = useUserDefaultData();

  const handleFinish = async (answers: KycAnswers) => {
    if (!currentUser) {
      return;
    }

    setLoading(true);

    try {
      await submitKycProfile({
        user: currentUser,
        personalInfo: personalInfo.values,
        answers,
      });

      await fetchCurrentUserData({
        uid: currentUser.uid,
        email: personalInfo.values.email,
        phone: personalInfo.values.phone,
      });

      window.location.href = "/";
    } catch (submissionError) {
      console.error("Error al completar el registro:", submissionError);
    } finally {
      setLoading(false);
    }
  };

  const questions = useHandleAnswer({
    onComplete: async (answers) => {
      await handleFinish(answers);
    },
  });

  const handlePersonalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!personalInfo.validate()) {
      return;
    }

    setStep("questions");
  };

  const handleBackFromQuestions = () => {
    if (questions.questionIndex === 0) {
      setStep("personal-info");
      return;
    }

    questions.goBack();
  };

  if (!currentUser) {
    return (
      <Stack className="py-6">
        <Alert>
          <AlertCircle />
          <AlertDescription>Inicia sesión para continuar</AlertDescription>
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack className="overflow-scroll h-full py-6">
      <Text variant="h2" className="text-muted-foreground">
        Queremos conocerte mejor{" "}
        <span className="font-bold text-foreground">
          {currentUser.firstName || "tenista"}
        </span>
      </Text>

      <div className="h-max">
        {step === "personal-info" ? (
          <PersonalInfoStep
            values={personalInfo.values}
            errors={personalInfo.errors}
            loading={loading}
            onFieldChange={personalInfo.updateField}
            onSubmit={handlePersonalSubmit}
          />
        ) : (
          <QuestionsStep
            question={questions.question}
            answers={questions.answers}
            questionIndex={questions.questionIndex}
            totalQuestions={questions.totalQuestions}
            progress={questions.progress}
            onBack={handleBackFromQuestions}
            onAnswer={questions.handler}
          />
        )}
      </div>
    </Stack>
  );
};

export default KycView;
