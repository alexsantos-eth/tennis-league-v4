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
    path: "/profile",
    pathRgx: "^/profile",
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
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
