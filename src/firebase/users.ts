import {
  collection,
  doc,
  type DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../config/firebase";

import { getCollection } from "./db";
import { USER_ROLE, type User } from "../types/users";

const USERS_COLLECTION = "users";

export const getUserDoc = async (
  id: string,
): Promise<DocumentReference<DocumentData>> => {
  const col = await getCollection("users");
  return doc(col, id);
};

export const getUser = async (id: string): Promise<User | undefined> => {
  const col = await getCollection("users");
  const userDoc = doc(col, id);

  const userData = (await getDoc(userDoc)).data() as User;
  return userData;
};

export const saveNewUser = async (props: Partial<User>): Promise<void> => {
  const col = await getCollection("users");
  const userDoc = doc(col);
  return setDoc(userDoc, props);
};

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const usersSnapshot: QuerySnapshot<DocumentData> =
      await getDocs(usersCollection);

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        name: userData.name || "",
        picture: userData.picture || "",
        utr: Number(userData.utr) || 0,
        phone: userData.phone || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        gender: userData.gender || "",
        role: userData.role || USER_ROLE.PLAYER,
        category: userData.category || "A",
      });
    });

    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));

    if (!userDoc.exists()) {
      return null;
    }
    const userData = userDoc.data();
    return {
      uid: userDoc.id,
      name: userData.name || "",
      picture: userData.picture || "",
      utr: Number(userData.utr) || 0,
      phone: userData.phone || "",
      role: userData.role || USER_ROLE.PLAYER,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      category: userData.category,
    } as User;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}

export async function createOrUpdateUser(
  userId: string,
  userData: Partial<User>,
): Promise<boolean> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...userData,
        role: USER_ROLE.PLAYER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
    }
    return true;
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    return false;
  }
}

export const uploadUserPicture = async (
  userId: string,
  file: File,
): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile-picture`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await updateDoc(doc(db, "users", userId), {
      picture: downloadURL,
      updatedAt: new Date().toISOString(),
    });

    return downloadURL;
  } catch (error) {
    console.error("Error al subir la foto:", error);
    throw error;
  }
};
