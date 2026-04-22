import { HistoryIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import BoxContainer from "@/components/ui/container";
import Stack from "@/components/ui/stack";
import Text from "@/components/ui/text";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/auth";

import ProfileSummaryCard from "./components/profile-summary-card";
import UpcomingMatchesSlider from "./components/upcoming-matches-slider";
import useProfile from "./hooks/use-profile";

const ProfilePage: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const authLoading = useAuthStore((state) => state.loading);
  const {
    user,
    fullName,
    isLoading,
    hasError,
    stats,
    upcomingMatches,
    rankingMatches,
    friendlyMatches,
  } = useProfile();

  const handleLogout = async () => {
    const didLogout = await logout();

    if (didLogout) {
      window.location.href = ROUTES.AUTH.path;
    }
  };

  return (
    <div className="w-full h-full overflow-scroll py-6 px-6 ">
      <div className="w-full flex flex-col gap-6">
        {isLoading && (
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando perfil...</AlertDescription>
          </Alert>
        )}

        {!isLoading && hasError && (
          <Alert>
            <InfoIcon />
            <AlertDescription>
              Ocurrio un problema al cargar la informacion del perfil.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !hasError && (
          <Stack noPx>
            <ProfileSummaryCard
              user={user}
              fullName={fullName}
              stats={stats}
              onLogout={handleLogout}
              isLoggingOut={authLoading}
            />

            <Stack noPx>
              {upcomingMatches.length > 0 ? (
                <UpcomingMatchesSlider
                  matches={upcomingMatches}
                  currentUserUid={user?.uid}
                />
              ) : (
                <div className="flex flex-col gap-4 mt-6">
                  <Alert>
                    <InfoIcon />
                    <AlertDescription>
                      Aun no tienes proximos partidos programados.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <BoxContainer title="Estadisticas" className="pt-2 pb-4">
                <Stack noPx>
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex gap-0 flex-col -ml-4">
                      <div className="flex items-center">
                        <CircularProgress
                          circleStrokeWidth={6}
                          labelClassName="text-xl font-bold"
                          progressStrokeWidth={10}
                          renderLabel={(progress) =>
                            `${(progress / 10).toFixed(2)}`
                          }
                          showLabel
                          size={120}
                          value={Number(stats?.[2]?.value) * 10 || 0}
                        />
                      </div>

                      <Text
                        variant="bodySmall"
                        className="font-bold text-primary text-center w-full -mt-2"
                      >
                        UTR
                      </Text>
                    </div>

                    <div className="max-w-max">
                      <div className="flex items-center gap-2">
                        <Text variant="bodySmall" className="text-foreground">
                          Categoria:
                        </Text>
                        <Text variant="body" className="text-primary font-bold">
                          {stats?.[0]?.value}
                        </Text>
                      </div>

                      <div className="flex items-center gap-2">
                        <Text variant="bodySmall" className="text-foreground">
                          Total amistosos:
                        </Text>
                        <Text variant="body" className="text-primary font-bold">
                          {friendlyMatches.length}
                        </Text>
                      </div>

                      <div className="flex items-center gap-2">
                        <Text variant="bodySmall" className="text-foreground">
                          Total competitivos:
                        </Text>
                        <Text variant="body" className="text-primary font-bold">
                          {rankingMatches.length}
                        </Text>
                      </div>

                      <Text
                        variant="bodyXs"
                        className="mt-2 text-muted-foreground max-w-30"
                      >
                        * La categoria se asigna segun tu UTR.
                      </Text>
                    </div>
                  </div>

                  <a href="/match" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <HistoryIcon />
                      Historial de partidos
                    </Button>
                  </a>
                </Stack>
              </BoxContainer>
            </Stack>
          </Stack>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
