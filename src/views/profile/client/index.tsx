import { HistoryIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/auth";
import useProfile from "./hooks/use-profile";
import ProfileSummaryCard from "./components/profile-summary-card";
import UpcomingMatchesSlider from "./components/upcoming-matches-slider";

const ProfilePage: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const authLoading = useAuthStore((state) => state.loading);
  const { user, fullName, isLoading, hasError, stats, upcomingMatches } = useProfile();

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
          <div className="pb-20">
            <ProfileSummaryCard
              user={user}
              fullName={fullName}
              stats={stats}
              onLogout={handleLogout}
              isLoggingOut={authLoading}
            />

            {upcomingMatches.length > 0 ? (
              <div className="flex flex-col gap-4 mt-6">
                <UpcomingMatchesSlider
                  matches={upcomingMatches}
                  currentUserUid={user?.uid}
                />

                <a href="/match" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <HistoryIcon />
                    Ver todos los partidos
                  </Button>
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <Alert>
                  <InfoIcon />
                  <AlertDescription>
                    Aun no tienes proximos partidos programados.
                  </AlertDescription>
                </Alert>

               <a href="/match" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <HistoryIcon />
                    Ver todos los partidos
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
