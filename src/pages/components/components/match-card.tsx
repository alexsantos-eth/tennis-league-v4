import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import BoxContainer from "../../../components/ui/container";
import Text from "../../../components/ui/text";

interface MatchCardPlayerProps {
  name: string;
  gtr: string;
  detailLabel?: string;
}

interface MatchCardProps {
  time: string;
  format: string;
  category: string;
  status: string;
  playerOne: MatchCardPlayerProps;
  playerTwo: MatchCardPlayerProps;
}

const MatchCard = ({
  time,
  format,
  category,
  status,
  playerOne,
  playerTwo,
}: MatchCardProps) => {
  return (
    <BoxContainer className="flex flex-col relative gap-4">
      <div className="flex flex-col relative gap-6">
        <div className="flex flex-col justify-center items-start">
          <div className="flex justify-start items-center relative gap-2 flex-wrap">
            <Text variant="h4" className="text-muted-foreground">
              {time}
            </Text>
            <Text variant="h4" className="font-bold text-foreground">
              {format}
            </Text>
          </div>
          <Text variant="body" className="text-foreground">
            {category}
          </Text>
        </div>

        <div className="absolute right-0 top-0">
          <Badge variant={status === "Reservado" ? "default" : "outline"}>
            {status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center w-full gap-4">
        <BoxContainer className="bg-accent w-full py-2 rounded-lg flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback className="bg-gray-200 font-semibold">PL</AvatarFallback>
          </Avatar>

          <div>
            <Text variant="body" className="text-foreground font-semibold">
              {playerOne.name}
            </Text>
            <Text
              variant="body"
              className="text-muted-foreground font-semibold"
            >
              {(playerOne.detailLabel ?? "GTR")}: {playerOne.gtr}
            </Text>
          </div>
        </BoxContainer>

        <BoxContainer className="bg-accent w-full py-2 rounded-lg flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback className="bg-gray-200 font-semibold">PL</AvatarFallback>
          </Avatar>

          <div>
            <Text variant="body" className="text-foreground font-semibold">
              {playerTwo.name}
            </Text>
            <Text
              variant="body"
              className="text-muted-foreground font-semibold"
            >
              {(playerTwo.detailLabel ?? "GTR")}: {playerTwo.gtr}
            </Text>
          </div>
        </BoxContainer>
      </div>
    </BoxContainer>
  );
};

export default MatchCard;
