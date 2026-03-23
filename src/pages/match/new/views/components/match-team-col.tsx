import { PlusIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Text from '@/components/ui/text';

interface MatchTeamColProps {
  title: string;
}

const MatchTeamCol: React.FC<MatchTeamColProps> = ({ title }) => {
  return (
    <div className="flex flex-col gap-7 items-center">
      <Text variant="body" className="text-foreground font-medium">
        {title}
      </Text>

      <div className="relative w-14 flex flex-col gap-2 items-center">
        <div className="relative">
          <Avatar size="lg">
            <AvatarFallback className="bg-gray-200 font-semibold">
              PL
            </AvatarFallback>
          </Avatar>

          <Badge
            variant="default"
            className="absolute -bottom-1 -right-1 rounded-full"
          >
            4.5
          </Badge>
        </div>

        <Text variant="bodySmall" className="text-foreground font-medium">
          Tu
        </Text>
      </div>

      <div className="relative w-14 flex flex-col gap-2 items-center">
        <div className="relative">
          <Button variant="outline" size="icon-lg" className='h-14  w-14 rounded-full border-dashed text-muted-foreground'>
            <PlusIcon/>
          </Button>
        </div>

        <Text variant="bodySmall" className="text-foreground font-medium">
          Invitar
        </Text>
      </div>
    </div>
  );
};

export default MatchTeamCol;
