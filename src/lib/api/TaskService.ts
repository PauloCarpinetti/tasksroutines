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
import { Task } from "@/model/Task";

// Nome da coleção no Firestore
const TASKS_COLLECTION = "tasks";

// --- CREATE ---
export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...taskData,
    routineId: taskData.routineId ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// --- READ ---
export async function getTasksForUser(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const ref = doc(db, TASKS_COLLECTION, taskId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Task;
}

// --- UPDATE (Atualizar) ---
export async function updateTask(
  taskId: string,
  dataToUpdate: Partial<Omit<Task, "id" | "createdAt">>
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, {
    ...dataToUpdate,
    routineId:
      dataToUpdate.routineId === undefined ? null : dataToUpdate.routineId,
    updatedAt: serverTimestamp(),
  });
}

// --- DELETE (Deletar) ---
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}
