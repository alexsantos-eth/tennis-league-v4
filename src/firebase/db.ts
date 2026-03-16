import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "@firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { app } from "../config/firebase";

let globalDB: Firestore | null = null;

const getFirestoreDB = async (): Promise<Firestore> => {
  globalDB = globalDB ?? getFirestore(app);
  return globalDB;
};

export const getCollection = async (
  colName: string,
): Promise<CollectionReference<DocumentData>> =>
  collection(await getFirestoreDB(), colName);

export default getFirestoreDB;
