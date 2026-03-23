import { PlayIcon } from "lucide-react";

import { Button } from "../../../../../components/ui/button";
import { useNewMatchStore } from "../../../../../store/new-match";

const CreateMatchButton: React.FC = () => {
  const isSubmitting = useNewMatchStore((state) => state.isSubmitting);

  return (
    <Button
      type="submit"
      className="h-12 rounded-2xl text-base font-semibold"
      disabled={isSubmitting}
    >
      <PlayIcon />
      {isSubmitting ? "Creando partido..." : "Crear partido"}
    </Button>
  );
};

export default CreateMatchButton;
