import type {
  KycAnswers,
  KycQuestion,
  PersonalInfoDraft,
  PersonalInfoErrors,
} from "@/types/kyc";
import type { User } from "@/types/users";
import { Calendar, Clock, PlayCircle, Trophy } from "lucide-react";

export const KYC_QUESTIONS: KycQuestion[] = [
  {
    title: "¿Cuál es el nivel más alto de tenis que has jugado?",
    description: "Selecciona tu nivel más alto de juego.",
    icon: Trophy,
    name: "nivel",
    options: [
      { label: "No juego pero quiero empezar", value: 0, icon: "🎾" },
      {
        label: "Tenis recreativo (casual, con amigos)",
        value: 1.5,
        icon: "🏸",
      },
      {
        label: "Torneos de club",
        value: 2.1,
        icon: "🏆",
      },
      {
        label: "Torneos ranking nacional",
        value: 2.8,
        icon: "🥇",
      },
      {
        label: "Torneos nacionales",
        value: 5.1,
        icon: "🏅",
      },
      {
        label: "Torneos internacionales",
        value: 6.5,
        icon: "🌎",
      },
      { label: "Profesional", value: 8, icon: "⭐" },
    ],
  },
  {
    title: "¿Con qué frecuencia juegas tenis?",
    description: "Indica tu frecuencia habitual de juego.",
    icon: Calendar,
    name: "frecuencia",
    options: [
      { label: "No juego pero quiero empezar", value: 0, icon: "🆕" },
      { label: "Algunas veces al año", value: 0.5, icon: "📅" },
      { label: "Algunas veces al mes", value: 1, icon: "📆" },
      { label: "Algunas veces a la semana", value: 2.21, icon: "📊" },
      { label: "Casi todos los días", value: 3, icon: "🔥" },
    ],
  },
  {
    title: "¿Cuántos partidos de 2 o más sets has jugado en tu vida?",
    description: "Selecciona el rango que mejor represente tu experiencia.",
    icon: PlayCircle,
    name: "partidos",
    options: [
      { label: "No juego partidos", value: 0, icon: "❌" },
      { label: "1-5 partidos", value: 0.5, icon: "1️⃣" },
      { label: "6-25 partidos", value: 1.5, icon: "2️⃣" },
      { label: "26+ partidos", value: 3, icon: "3️⃣" },
    ],
  },
  {
    title: "¿Cuántos años llevas jugando tenis?",
    description: "Indica tu tiempo de experiencia en el deporte.",
    icon: Clock,
    name: "experiencia",
    options: [
      { label: "Menos de 1 año", value: 0, icon: "🌱" },
      { label: "1-3 años", value: 0.5, icon: "🌿" },
      { label: "4-6 años", value: 1, icon: "🌳" },
      { label: "7-10 años", value: 1.5, icon: "🌲" },
      { label: "Más de 10 años", value: 2, icon: "🏛️" },
    ],
  },
];

export const QUESTION_ANIMATION_DELAYS = [
  "animate-delay-0",
  "animate-delay-100",
  "animate-delay-200",
  "animate-delay-300",
  "animate-delay-400",
  "animate-delay-500",
  "animate-delay-600",
  "animate-delay-700",
  "animate-delay-800",
  "animate-delay-900",
];

export const calculateKycScore = (answers: KycAnswers) => {
  return Object.values(answers).reduce((total, value) => total + value, 0);
};

export default KYC_QUESTIONS;

export const GENDER_OPTIONS = [
  {
    label: "Hombre",
    value: "hombre" as const,
  },
  {
    label: "Mujer",
    value: "mujer" as const,
  },
];

export const buildPersonalInfoDraft = (
  currentUser: User | null,
): PersonalInfoDraft => {
  return {
    firstName: currentUser?.firstName?.toString().trim() ?? "",
    lastName: currentUser?.lastName?.toString().trim() ?? "",
    email: currentUser?.email?.toString().trim() ?? "",
    phone: currentUser?.phone?.toString().trim() ?? "",
    gender: (currentUser?.gender as PersonalInfoDraft["gender"]) ?? "",
    picture: currentUser?.picture?.toString().trim() ?? "",
  };
};

export const validatePersonalInfo = (
  draft: PersonalInfoDraft,
): PersonalInfoErrors => {
  const errors: PersonalInfoErrors = {};

  if (draft.firstName.trim().length < 2) {
    errors.firstName = "Ingresa tu nombre";
  }

  if (draft.lastName.trim().length < 2) {
    errors.lastName = "Ingresa tu apellido";
  }

  if (!draft.email.trim()) {
    errors.email = "Ingresa tu correo";
  } else if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
    errors.email = "El correo no es válido";
  }

  if (draft.phone.trim().length < 8) {
    errors.phone = "Ingresa un número válido";
  }

  if (!draft.gender) {
    errors.gender = "Selecciona tu género";
  }

  return errors;
};
