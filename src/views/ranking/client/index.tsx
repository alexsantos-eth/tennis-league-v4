import { InfoIcon, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAllUsers } from "../../../firebase/users";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import BoxContainer from "../../../components/ui/container";
import { Input } from "../../../components/ui/input";
import Stack from "../../../components/ui/stack";
import { CATEGORIES, getCategory } from "../../../lib/category";
import { calculateRankingByUTR } from "../../../lib/ranking";
import { useAuthStore } from "../../../store/auth";
import type { RankingUser, User } from "../../../types/users";

import CategorySelector from "./components/category-selector";
import RankingTable from "./components/ranking-table";
import UserProfileCard from "./components/user-profile-card";

const getDisplayName = (user: Partial<User>) => {
  const byNames = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (byNames.length > 0) {
    return byNames;
  }

  if ((user.name || "").trim().length > 0) {
    return String(user.name || "");
  }

  return "Jugador";
};

const mapUserToRankingUser = (user: User, currentUserUid?: string): RankingUser => {
  const normalizedUtr = Number(user.utr) || 0;

  return {
    ...user,
    uid: String(user.uid || ""),
    utr: normalizedUtr,
    category: user.category || getCategory({ utr: normalizedUtr }),
    name: getDisplayName(user),
    isCurrentUser: Boolean(currentUserUid && user.uid === currentUserUid),
  };
};

const RankingPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const allUsers = await getAllUsers();

        if (!isMounted) {
          return;
        }

        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading ranking users:", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const rankingUsers = useMemo(
    () =>
      users
        .map((user) => mapUserToRankingUser(user, currentUser?.uid))
        .sort((a, b) => (Number(b.utr) || 0) - (Number(a.utr) || 0)),
    [users, currentUser?.uid]
  );

  const normalizedCurrentUser = useMemo(() => {
    if (!currentUser?.uid) {
      return null;
    }

    const normalizedUtr = Number(currentUser.utr) || 0;

    return {
      ...currentUser,
      uid: String(currentUser.uid),
      utr: normalizedUtr,
      category: currentUser.category || getCategory({ utr: normalizedUtr }),
      name: getDisplayName(currentUser),
    } as User;
  }, [currentUser]);

  const usersInActiveCategory = useMemo(
    () => rankingUsers.filter((user) => user.category === activeCategory),
    [rankingUsers, activeCategory]
  );

  const visibleUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return usersInActiveCategory;
    }

    return usersInActiveCategory.filter((user) =>
      user.name.toLowerCase().includes(normalizedQuery)
    );
  }, [usersInActiveCategory, searchQuery]);

  const currentUserCategoryRank = useMemo(() => {
    if (!normalizedCurrentUser) {
      return "-";
    }

    const currentUserCategory = normalizedCurrentUser.category;
    const sameCategoryUsers = rankingUsers.filter(
      (user) => user.category === currentUserCategory
    );

    if (sameCategoryUsers.length === 0) {
      return "-";
    }

    return calculateRankingByUTR(
      String(Number(normalizedCurrentUser.utr || 0)),
      sameCategoryUsers.map((user) => ({
        utr: String(Number(user.utr || 0)),
      }))
    );
  }, [normalizedCurrentUser, rankingUsers]);

  const currentUserOverallRank = useMemo(() => {
    if (!normalizedCurrentUser || rankingUsers.length === 0) {
      return "-";
    }

    return calculateRankingByUTR(
      String(Number(normalizedCurrentUser.utr || 0)),
      rankingUsers.map((user) => ({
        utr: String(Number(user.utr || 0)),
      }))
    );
  }, [normalizedCurrentUser, rankingUsers]);

  return (
    <Stack className="h-full overflow-scroll py-6" noPx>
      <Stack className="w-full">
        {isLoading && (
          <Alert>
            <InfoIcon />
            <AlertDescription>Cargando ranking...</AlertDescription>
          </Alert>
        )}

        {!isLoading && hasError && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertDescription>
              Ocurrio un problema al cargar los jugadores.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !hasError && (
          <>
            <UserProfileCard
              user={normalizedCurrentUser}
              userCategoryRank={currentUserCategoryRank}
              overallRank={currentUserOverallRank}
            />

            <BoxContainer className="shadow-sm p-4 gap-4 flex flex-col">
              <div className="relative w-full">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar jugador"
                  className="pl-10"
                />
              </div>

              <CategorySelector
                activeCategory={activeCategory}
                categories={CATEGORIES as string[]}
                onCategoryChange={setActiveCategory}
              />

              <RankingTable users={visibleUsers} />
            </BoxContainer>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default RankingPage;
