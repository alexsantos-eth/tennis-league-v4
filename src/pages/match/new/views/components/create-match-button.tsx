import { PlayIcon } from "lucide-react";

import { Button } from "../../../../../components/ui/button";

interface CreateMatchButtonProps {
  isSubmitting: boolean;
}

const CreateMatchButton: React.FC<CreateMatchButtonProps> = ({
  isSubmitting,
}) => {
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
