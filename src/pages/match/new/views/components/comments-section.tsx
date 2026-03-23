import { Textarea } from "@/components/ui/textarea";

import BoxContainer from "../../../../../components/ui/container";

interface CommentsSectionProps {
  comments: string;
  onCommentsChange: (value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onCommentsChange,
}) => {
  return (
    <BoxContainer className="p-0 overflow-hidden" title="Comentarios">
      <Textarea
        value={comments}
        className="rounded-2xl p-4"
        placeholder="Agrega detalles adicionales"
        onChange={(event) => onCommentsChange(event.target.value)}
      />
    </BoxContainer>
  );
};

export default CommentsSection;
