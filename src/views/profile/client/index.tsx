import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import useProfile from "./hooks/use-profile";
import ProfileSummaryCard from "./components/profile-summary-card";
import UpcomingMatchCard from "./components/upcoming-match-card";

const ProfilePage: React.FC = () => {
  const { user, fullName, isLoading, hasError, stats, upcomingMatch } = useProfile();

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
          <>
            <ProfileSummaryCard user={user} fullName={fullName} stats={stats} />

            {Boolean(upcomingMatch) ? (
              upcomingMatch && (
                <UpcomingMatchCard
                  match={upcomingMatch}
                  currentUserUid={user?.uid as string}
                />
              )
            ) : (
              <Alert>
                <InfoIcon />
                <AlertDescription>
                  Aun no tienes proximos partidos programados.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
