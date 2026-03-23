import { InfoIcon } from "lucide-react";
import { Else, If, Then } from "react-if";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import useProfile from "./hooks/use-profile";
import ProfileSummaryCard from "./components/profile-summary-card";
import UpcomingMatchCard from "./components/upcoming-match-card";

const ProfilePage: React.FC = () => {
  const { user, fullName, isLoading, hasError, stats, upcomingMatch } = useProfile();

  return (
    <div className="w-full h-full overflow-scroll py-6 px-6 ">
      <div className="w-full flex flex-col gap-6">
        <If condition={isLoading}>
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>Cargando perfil...</AlertDescription>
            </Alert>
          </Then>
        </If>

        <If condition={!isLoading && hasError}>
          <Then>
            <Alert>
              <InfoIcon />
              <AlertDescription>
                Ocurrio un problema al cargar la informacion del perfil.
              </AlertDescription>
            </Alert>
          </Then>
        </If>

        <If condition={!isLoading && !hasError}>
          <Then>
            <ProfileSummaryCard user={user} fullName={fullName} stats={stats} />

            <If condition={Boolean(upcomingMatch)}>
              <Then>
                {upcomingMatch && (
                  <UpcomingMatchCard
                    match={upcomingMatch}
                    currentUserUid={user?.uid as string}
                  />
                )}
              </Then>

              <Else>
                <Alert>
                  <InfoIcon />
                  <AlertDescription>
                    Aun no tienes proximos partidos programados.
                  </AlertDescription>
                </Alert>
              </Else>
            </If>
          </Then>
        </If>
      </div>
    </div>
  );
};

export default ProfilePage;
