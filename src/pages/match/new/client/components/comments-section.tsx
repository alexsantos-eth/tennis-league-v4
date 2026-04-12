import BoxContainer from "@/components/ui/container";
import { Textarea } from "@/components/ui/textarea";
import { useNewMatchStore } from "@/store/new-match";

const CommentsSection: React.FC = () => {
  const comments = useNewMatchStore((state) => state.comments);
  const setComments = useNewMatchStore((state) => state.setComments);

  return (
    <BoxContainer className="p-0 overflow-hidden" title="Comentarios">
      <Textarea
        value={comments}
        className="rounded-2xl p-4"
        placeholder="Agrega detalles adicionales"
        onChange={(event) => setComments(event.target.value)}
      />
    </BoxContainer>
  );
};

export default CommentsSection;
