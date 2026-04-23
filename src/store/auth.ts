import { type User as UserFirebase, type UserCredential } from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  getCurrentUser as getCurrentUserFirebase,
  logoutUser as logoutUserFirebase,
} from "../firebase/auth";

import { createOrUpdateUser, getUserById } from "../firebase/users";
import { getCategory } from "../lib/category";
import { USER_ROLE, type User } from "../types/users";

interface AuthState {
  loading: boolean;
  error: string | null;
  phoneNumber: string | null;
  currentUser: User | null;
  firebaseUserData: UserFirebase | null;
  isAuthenticated: boolean;
  getCurrentUser: () => UserFirebase | null;
  getPersonalInfo: (id: string) => Promise<User | null>;
  fetchCurrentUserData: (
    credential?: Partial<User> | Partial<UserFirebase> | UserCredential | null
  ) => Promise<User | null>;
  setPhoneNumber: (phone: string) => void;
  logout: (callback?: () => void) => Promise<boolean>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loading: false,
      error: null,
      phoneNumber: null,
      currentUser: null,
      firebaseUserData: null,
      isAuthenticated: false,
      getCurrentUser: getCurrentUserFirebase,
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      getPersonalInfo: async (id: string) => {
        try {
          return await getUserById(id);
        } catch (error) {
          console.error("Error getting user info:", error);
          return null;
        }
      },

      fetchCurrentUserData: async (
        credential:
          | Partial<User>
          | Partial<UserFirebase>
          | UserCredential
          | null
          | undefined = null
      ) => {
        let firebaseUser: Partial<User> | Partial<UserFirebase> =
          (credential as User) ?? getCurrentUserFirebase();
        let firebaseCredentialUser: UserFirebase | null =
          (credential as Partial<UserFirebase>)?.uid
            ? (credential as UserFirebase)
            : (getCurrentUserFirebase() as UserFirebase | null);

        if (credential && "user" in credential) {
          firebaseUser = (credential as UserCredential)
            .user as Partial<UserFirebase>;
          firebaseCredentialUser = (credential as UserCredential).user;
        }

        const uid = (firebaseUser as User)?.uid;

        if (!uid) {
          set({
            isAuthenticated: false,
            currentUser: null,
            firebaseUserData: null,
          });
          return null;
        }

        set({ loading: true, error: null });

        try {
          const displayName = (firebaseCredentialUser?.displayName || "").trim();
          const [firstName = "", ...lastNameParts] = displayName
            .split(/\s+/)
            .filter(Boolean);
          const lastName = lastNameParts.join(" ");

          const userData = await getUserById(uid);

          if (userData) {
            const fullCurrentUser: User = {
              ...userData,
              uid: userData.uid || uid,
              utr: Number(userData.utr) || 0,
              name:
                userData.name ||
                `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
              email:
                userData.email ||
                (firebaseCredentialUser?.email as string) ||
                "",
              phone: userData.phone || "",
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              picture: userData.picture || "",
              role: userData.role || USER_ROLE.PLAYER,
              provider:
                userData.provider ||
                firebaseCredentialUser?.providerData?.[0]?.providerId ||
                "google.com",
              category: userData.category || getCategory(userData),
              kycCompleted: Boolean(userData.kycCompleted),
            };

            set({
              currentUser: fullCurrentUser,
              firebaseUserData: firebaseCredentialUser,
              phoneNumber: userData.phone,
              isAuthenticated: true,
              loading: false,
              error: null,
            });

            return fullCurrentUser;
          } else {
            const seedUserData: Partial<User> = {
              uid,
              name: displayName,
              firstName,
              lastName,
              email: firebaseCredentialUser?.email || "",
              phone: firebaseCredentialUser?.phoneNumber || "",
              picture: firebaseCredentialUser?.photoURL || "",
              provider: firebaseCredentialUser?.providerData?.[0]?.providerId || "google.com",
              role: USER_ROLE.PLAYER,
              utr: 0,
              category: "D",
            };

            const wasCreated = await createOrUpdateUser(uid, seedUserData);

            if (!wasCreated) {
              set({
                loading: false,
                error: "No se pudo crear el usuario",
                isAuthenticated: false,
                currentUser: null,
                firebaseUserData: null,
              });

              return null;
            }

            const fullCurrentUser: User = {
              uid,
              name: seedUserData.name || `${firstName} ${lastName}`.trim(),
              firstName,
              lastName,
              email: seedUserData.email || "",
              phone: seedUserData.phone || "",
              picture: seedUserData.picture || "",
              provider: seedUserData.provider || "google.com",
              role: USER_ROLE.PLAYER,
              utr: 0,
              category: getCategory({ utr: 0 }),
              kycCompleted: false,
            };

            set({
              loading: false,
              error: null,
              currentUser: fullCurrentUser,
              firebaseUserData: firebaseCredentialUser,
              phoneNumber: fullCurrentUser.phone,
              isAuthenticated: true,
            });

            return fullCurrentUser;
          }
        } catch (error) {
          console.error("Error fetching current user data:", error);
          set({
            loading: false,
            error: "Error al obtener datos del usuario",
            currentUser: null,
            firebaseUserData: null,
            isAuthenticated: false,
          });
          return null;
        }
      },

      logout: async (callback?: () => void) => {
        set({ loading: true, error: null });
        try {
          const result = await logoutUserFirebase();
          await fetch("/api/auth", {
            method: "DELETE",
          });

          set({
            loading: false,
            phoneNumber: null,
            currentUser: null,
            firebaseUserData: null,
            isAuthenticated: false,
            error: null,
          });

          if (callback) callback();
          return result;
        } catch (error) {
          set({
            loading: false,
            error: (error as Error).message || "Error al cerrar sesión",
          });
          return false;
        }
      },

      setError: (error) => set({ error }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
