import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth";

import {
  buildPersonalInfoDraft,
  validatePersonalInfo,
} from "../tools/questions";

import type {
  PersonalInfoDraft,
  PersonalInfoErrors,
  PersonalInfoField,
} from "@/types/kyc";
const useUserDefaultData = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [values, setValues] = useState<PersonalInfoDraft>(() => {
    return buildPersonalInfoDraft(currentUser);
  });
  const [errors, setErrors] = useState<PersonalInfoErrors>({});

  useEffect(() => {
    setValues(buildPersonalInfoDraft(currentUser));
    setErrors({});
  }, [currentUser]);

  const updateField = (field: PersonalInfoField, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = () => {
    const nextErrors = validatePersonalInfo(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return {
    values,
    errors,
    updateField,
    setValues,
    validate,
    currentUser,
  } as const;
};

export default useUserDefaultData;
