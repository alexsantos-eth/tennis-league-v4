import Stack from "@/components/ui/stack";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BoxContainer from "@/components/ui/container";
import Text from "@/components/ui/text";

interface MatchCardPlayerProps {
  name: string;
  gtr: string;
  detailLabel?: string;
}

interface MatchCardProps {
  time: string;
  format: string;
  type: string;
  category: string;
  status: string;
  playerOne: MatchCardPlayerProps;
  playerTwo: MatchCardPlayerProps;
}

const MatchCard = ({
  time,
  format,
  type,
  category,
  status,
  playerOne,
  playerTwo,
}: MatchCardProps) => {
  const getStatusBadgeVariant = () => {
    if (status === "Abierto") {
      return "outline";
    }

    if (status === "En apelacion") {
      return "destructive";
    }

    return "default";
  };

  return (
    <BoxContainer className="flex flex-col relative gap-4">
      <Stack noPx className="relative">
        <div className="flex flex-col justify-center items-start">
          <div className="flex justify-start items-center relative gap-2 flex-wrap">
            <Text
              variant="bodyLarge"
              className="font-semibold text-muted-foreground"
            >
              {type}
            </Text>

            <Text variant="bodyLarge" className="font-bold text-foreground">
              {format}
            </Text>
          </div>

          <div className="flex justify-start items-center relative gap-2 flex-wrap">
            <Text
              variant="body"
              className="font-semibold text-muted-foreground"
            >
              {time}
            </Text>

            <Text variant="body" className="text-foreground">
              {category}
            </Text>
          </div>
        </div>

        <div className="absolute right-0 top-0">
          <Badge variant={getStatusBadgeVariant()}>
            {status}
          </Badge>
        </div>
      </Stack>

      <div className="grid grid-cols-2 w-full gap-4">
        <BoxContainer className="bg-accent py-2 rounded-lg flex items-center gap-2 border">
          <Avatar size="default">
            <AvatarFallback className="bg-gray-200 font-semibold">
              PL
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0 overflow-hidden">
            <Text
              variant="body"
              className="truncate text-foreground leading-4 font-semibold"
            >
              {playerOne.name}
            </Text>
            <Text variant="bodySmall" className="text-muted-foreground">
              {playerOne.detailLabel ?? "GTR"}: {playerOne.gtr}
            </Text>
          </div>
        </BoxContainer>

        <BoxContainer className="bg-accent w-full py-2 rounded-lg flex items-center gap-2 border">
          <Avatar size="default">
            <AvatarFallback className="bg-gray-200 font-semibold">
              PL
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0 overflow-hidden">
            <Text
              variant="body"
              className="truncate text-foreground leading-4 font-semibold"
            >
              {playerTwo.name}
            </Text>
            <Text variant="bodySmall" className="text-muted-foreground">
              {playerTwo.detailLabel ?? "GTR"}: {playerTwo.gtr}
            </Text>
          </div>
        </BoxContainer>
      </div>
    </BoxContainer>
  );
};

export default MatchCard;
