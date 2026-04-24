import { PlayIcon } from "lucide-react";

import ActionButton from "@/components/ui/action-button";
import { useNewMatchStore } from "@/store/new-match";

const CreateMatchButton: React.FC = () => {
  const isSubmitting = useNewMatchStore((state) => state.isSubmitting);

  return (
    <ActionButton type="submit" disabled={isSubmitting}>
      <PlayIcon />
      {isSubmitting ? "Creando partido..." : "Crear partido"}
    </ActionButton>
  );
};

export default CreateMatchButton;
