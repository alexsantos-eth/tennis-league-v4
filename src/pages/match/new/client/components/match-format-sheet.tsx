import { AlertCircle, Check, ChevronRight, Users2 } from "lucide-react";

import BoxContainer from "@/components/ui/container";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useNewMatchStore } from "@/store/new-match";

import { matchFormatLabels, matchFormats } from "../contants";

import type { PublicMatchFormat } from "@/types/match";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Stack from "@/components/ui/stack";

const MatchFormatSheet: React.FC = () => {
  const open = useNewMatchStore((state) => state.isMatchFormatSheetOpen);
  const matchFormat = useNewMatchStore((state) => state.matchFormat);
  const setIsMatchFormatSheetOpen = useNewMatchStore(
    (state) => state.setIsMatchFormatSheetOpen,
  );
  const confirmMatchFormat = useNewMatchStore(
    (state) => state.confirmMatchFormat,
  );

  const handleSelectFormat = (value: PublicMatchFormat) => {
    confirmMatchFormat(value);
  };

  return (
    <Sheet open={open} onOpenChange={setIsMatchFormatSheetOpen}>
      <SheetContent
        side="bottom"
        aria-describedby="match-format-sheet-description"
      >
        <SheetHeader>
          <SheetTitle>Tipo de partido</SheetTitle>
        </SheetHeader>

        <Stack className="pb-6">
          <Alert>
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              En competitivo tu score (GTR) se vera afectado.
            </AlertDescription>
          </Alert>

          <BoxContainer className="p-0 overflow-hidden border border-border">
            {matchFormats.map((item) => {
              const isSelected = item === matchFormat;

              return (
                <button
                  key={item}
                  type="button"
                  className="w-full px-4 py-4 flex items-center gap-4 border-b border-border/70 last:border-b-0"
                  onClick={() => handleSelectFormat(item)}
                >
                  <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
                    <Users2 className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <Text
                    variant="body"
                    className="text-foreground font-medium flex-1 text-left"
                  >
                    {matchFormatLabels[item]}
                  </Text>

                  {isSelected ? (
                    <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                </button>
              );
            })}
          </BoxContainer>
        </Stack>
      </SheetContent>
    </Sheet>
  );
};

export default MatchFormatSheet;
