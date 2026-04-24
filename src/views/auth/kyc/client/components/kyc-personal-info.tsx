import {
  Check,
  ChevronRight,
  Mars,
  Phone,
  SaveIcon,
  User,
  Venus,
} from "lucide-react";
import { type FC, type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import MatchButtonRow from "@/views/match/new/client/components/match-button-row";

import { GENDER_OPTIONS } from "../tools/questions";
import KycInput from "./kyc-input";

import type { PersonalInfoDraft, PersonalInfoErrors } from "@/types/kyc";
import ActionButton from "@/components/ui/action-button";
interface PersonalInfoStepProps {
  values: PersonalInfoDraft;
  errors: PersonalInfoErrors;
  loading?: boolean;
  onFieldChange: (field: keyof PersonalInfoDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const PersonalInfoStep: FC<PersonalInfoStepProps> = ({
  values,
  errors,
  loading = false,
  onFieldChange,
  onSubmit,
}) => {
  const [genderOption, setGenderOption] = useState<string>(values.gender);

  const handleGenderSelect = (value: string) => {
    setGenderOption(value);
    onFieldChange("gender", value);
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack noPx>
        <BoxContainer title="Completa tus datos">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <KycInput
                title="Nombre"
                icon={<User className="size-4" />}
                value={values.firstName}
                placeholder="Tu nombre"
                error={errors.firstName}
                onChange={(event) =>
                  onFieldChange("firstName", event.target.value)
                }
              />

              <KycInput
                title="Apellido"
                icon={<User className="size-4" />}
                value={values.lastName}
                placeholder="Tu apellido"
                error={errors.lastName}
                onChange={(event) =>
                  onFieldChange("lastName", event.target.value)
                }
              />

              <KycInput
                title="Teléfono"
                icon={<Phone className="size-4" />}
                type="tel"
                inputMode="tel"
                value={values.phone}
                placeholder="12345678"
                error={errors.phone}
                onChange={(event) => onFieldChange("phone", event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Text variant="bodySmall" className="font-semibold">
                  Género
                </Text>
                <Text variant="bodyXs">
                  Esto nos ayuda a personalizar tu perfil.
                </Text>
              </div>

              <div>
                {GENDER_OPTIONS.map((option) => (
                  <MatchButtonRow
                    key={option.value}
                    className="px-0"
                    onClick={() => handleGenderSelect(option.value)}
                    icon={
                      option.value === "hombre" ? (
                        <Mars className="h-4 w-4" />
                      ) : (
                        <Venus className="h-4 w-4" />
                      )
                    }
                    title={option.label}
                  >
                    {genderOption === option.value ? (
                      <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-primary" />
                    )}
                  </MatchButtonRow>
                ))}
              </div>

              {errors.gender && (
                <p className="text-xs text-rose-300">{errors.gender}</p>
              )}
            </div>
          </div>
        </BoxContainer>

        <ActionButton disabled={loading} type="submit">
          <SaveIcon />
          {loading ? "Guardando..." : "Confirmar"}
        </ActionButton>
      </Stack>
    </form>
  );
};

export default PersonalInfoStep;
