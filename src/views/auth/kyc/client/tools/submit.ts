import { createOrUpdateUser } from "@/firebase/users";
import { getCategory } from "@/lib/category";
import type { User } from "@/types/users";

import { calculateKycScore } from "./questions";
import type { KycAnswers, PersonalInfoDraft } from "@/types/kyc";

interface SubmitKycProfileInput {
  user: User;
  personalInfo: PersonalInfoDraft;
  answers: KycAnswers;
}

export const submitKycProfile = async ({
  user,
  personalInfo,
  answers,
}: SubmitKycProfileInput) => {
  if (!user.uid) {
    throw new Error("No se encontró el usuario autenticado");
  }

  const utr = calculateKycScore(answers);
  const category = getCategory({ utr });
  const trimmedFirstName = personalInfo.firstName.trim();
  const trimmedLastName = personalInfo.lastName.trim();

  const payload: Partial<User> = {
    uid: user.uid,
    name: `${trimmedFirstName} ${trimmedLastName}`.trim(),
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    email: personalInfo.email.trim(),
    phone: personalInfo.phone.trim(),
    gender: personalInfo.gender || undefined,
    picture: personalInfo.picture || user.picture || "",
    utr,
    category,
    role: user.role,
    kycCompleted: true,
  };

  await createOrUpdateUser(user.uid, payload);

  const response = await fetch("/api/auth/kyc", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("No se pudo marcar el KYC como completado");
  }

  return {
    utr,
    category,
    payload,
  };
};