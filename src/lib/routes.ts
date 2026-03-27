export const ROUTES = {
  AUTH: {
    path: "/auth",
    pathRgx: "^/auth",
    public: true,
  },
  HOME: {
    path: "/",
    pathRgx: "^/$",
    public: false,
  },
  PROFILE: {
    path: "/perfil",
    pathRgx: "^/perfil",
    public: false,
  },
  MATCH: {
    path: "/match",
    pathRgx: "^/match",
    public: false,
  },
  NEW_MATCH: {
    path: "/match/new",
    pathRgx: "^/match/new",
    public: false,
  },
  ADD_PLAYERS: {
    path: "/match/new/add-players",
    pathRgx: "^/match/new/add-players",
    public: false,
  },
  ADD_PLAYERS_TO_MATCH: {
    path: (matchId: string) => `/match/${matchId}/add-players`,
    pathRgx: "^/match/[^/]+/add-players",
    public: false,
  },
  CONFIRM_MATCH_SCORE: {
    path: (matchId: string) => `/match/${matchId}/confirm-score`,
    pathRgx: "^/match/[^/]+/confirm-score",
    public: false,
  },
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
