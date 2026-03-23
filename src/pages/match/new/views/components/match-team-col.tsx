import { PlusIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Text from '@/components/ui/text';
import { ROUTES } from '@/lib/routes';
import { useNewMatchStore } from '@/store/new-match';
import type { MatchCreatorSummary } from '@/types/match';

interface MatchTeamColProps {
  title: string;
  team: 'A' | 'B';
}

const getInitials = (name: string) => {
  const [first = '', second = ''] = name.trim().split(' ');
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || 'PL';
};

const MatchTeamCol: React.FC<MatchTeamColProps> = ({ title, team }) => {
  const invitedPlayers = useNewMatchStore((state) => state.invitedPlayers);
  const hostPlayer = invitedPlayers[0];
  const guestPlayers = invitedPlayers.slice(1);
  const teamPlayers = (
    team === 'A'
      ? [hostPlayer, ...guestPlayers.filter((_, index) => index % 2 === 0)]
      : guestPlayers.filter((_, index) => index % 2 !== 0)
  ).filter((player): player is MatchCreatorSummary => Boolean(player));

  return (
    <div className="flex flex-col gap-5 items-center">
      <Text variant="body" className="text-foreground font-medium">
        {title}
      </Text>

      <div className="w-full flex flex-col gap-3 items-center">
        {teamPlayers.map((player) => (
          <div key={player?.id} className="relative w-14 flex flex-col gap-2 items-center">
            <div className="relative">
              <Avatar size="lg">
                {Boolean(player?.picture) && (
                  <AvatarImage src={player?.picture} alt={player?.name} />
                )}
                <AvatarFallback className="bg-gray-200 font-semibold text-foreground">
                  {getInitials(player?.name || '')}
                </AvatarFallback>
              </Avatar>

              <Badge
                variant="default"
                className="absolute -bottom-1 -right-1 rounded-full"
              >
                {Number(player?.gtr || 0).toFixed(1)}
              </Badge>
            </div>

            <Text variant="bodySmall" className="text-foreground font-medium">
              {player?.id === hostPlayer?.id ? 'Tu' : 'Invitado'}
            </Text>
          </div>
        ))}

        {teamPlayers.length === 0 && (
          <div className="w-14 h-14 rounded-full border border-dashed border-border" />
        )}

        <div className="relative w-14 flex flex-col gap-2 items-center">
          <Button
            asChild
            variant="outline"
            size="icon-lg"
            className="h-14 w-14 rounded-full border-dashed text-muted-foreground"
          >
            <a href={ROUTES.ADD_PLAYERS.path} aria-label="Invitar jugadores">
              <PlusIcon />
            </a>
          </Button>

          <Text variant="bodySmall" className="text-foreground font-medium">
            Invitar
          </Text>
        </div>
      </div>
    </div>
  );
};

export default MatchTeamCol;
