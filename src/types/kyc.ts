import type { ComponentType, SVGProps } from "react";

export type KycStep = "personal-info" | "questions";

export interface PersonalInfoDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "hombre" | "mujer" | "";
  picture: string;
}

export type PersonalInfoField = keyof PersonalInfoDraft;

export type PersonalInfoErrors = Partial<Record<PersonalInfoField, string>>;

export interface KycQuestionOption {
  label: string;
  value: number;
  icon: string;
}

export interface KycQuestion {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
  options: KycQuestionOption[];
}

export type KycAnswers = Record<string, number>;