export interface AuthUser {
  [index: string]: string | number | undefined | null | boolean;
  uid: string;
  email?: string;
  phone?: string;
  role: USER_ROLE;
  provider: string;
  picture?: string;
  lastName?: string;
  firstName?: string;
  gender?: "hombre" | "mujer";
}

export enum USER_ROLE {
  ADMIN = "admin",
  PLAYER = "player",
}

export interface RankingUser {
  [index: string]: string | number | undefined | null | boolean;
  isCurrentUser?: boolean;
  utr: number;
  picture?: string;
  category: string;
  name: string;
  uid: string;
}

export type User = Partial<AuthUser> & RankingUser;
