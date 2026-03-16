import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return false;
  }
};
