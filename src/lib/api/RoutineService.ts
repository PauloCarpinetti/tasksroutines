import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Routine } from "@/model/Routine";

// Nome da coleção no Firestore para rotinas
const ROUTINES_COLLECTION = "routines";

// --- CREATE (Criar Rotina) ---
export async function createRoutine(
  routineData: Omit<Routine, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, ROUTINES_COLLECTION), {
    ...routineData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// --- READ (Ler uma rotina específica) ---

export async function getRoutineById(
  routineId: string
): Promise<Routine | null> {
  const routineRef = doc(db, ROUTINES_COLLECTION, routineId);
  const docSnap = await getDoc(routineRef);

  if (!docSnap.exists()) return null;

  return { id: docSnap.id, ...docSnap.data() } as Routine;
}

// --- READ ---
export async function getRoutinesForUser(userId: string): Promise<Routine[]> {
  const q = query(
    collection(db, ROUTINES_COLLECTION),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Routine));
}

// --- UPDATE ---
export async function updateRoutine(
  routineId: string,
  dataToUpdate: Partial<Omit<Routine, "id" | "createdAt">>
): Promise<void> {
  const routineRef = doc(db, ROUTINES_COLLECTION, routineId);
  await updateDoc(routineRef, {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
  });
}

// --- DELETE ---
export async function deleteRoutine(routineId: string): Promise<void> {
  const routineRef = doc(db, ROUTINES_COLLECTION, routineId);
  await deleteDoc(routineRef);
}
