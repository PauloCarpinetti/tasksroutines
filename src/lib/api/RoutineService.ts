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
/**
 * Cria uma nova rotina no Firestore.
 * @param routineData Os dados da rotina a serem criados (excluindo id, createdAt, updatedAt).
 * @returns Uma Promise que resolve para o ID da rotina criada.
 */
export async function createRoutine(
  routineData: Omit<Routine, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const newRoutine = {
    ...routineData,
    createdAt: serverTimestamp(), // Usar serverTimestamp para consistência
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, ROUTINES_COLLECTION), newRoutine);
  return docRef.id;
}

// --- READ (Ler uma rotina específica) ---
/**
 * Obtém uma rotina específica pelo seu ID.
 * @param routineId O ID da rotina.
 * @returns Uma Promise que resolve para a rotina ou null se não for encontrada.
 */
export async function getRoutineById(
  routineId: string
): Promise<Routine | null> {
  const routineRef = doc(db, ROUTINES_COLLECTION, routineId);
  const docSnap = await getDoc(routineRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Routine;
  } else {
    return null;
  }
}

// --- READ (Ler rotinas de um usuário específico) ---
/**
 * Obtém todas as rotinas para um usuário específico.
 * @param userId O ID do usuário.
 * @returns Uma Promise que resolve para uma lista de rotinas.
 */
export async function getRoutinesForUser(userId: string): Promise<Routine[]> {
  const routinesRef = collection(db, ROUTINES_COLLECTION);
  const q = query(routinesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const routines: Routine[] = [];
  querySnapshot.forEach((doc) => {
    routines.push({ id: doc.id, ...doc.data() } as Routine);
  });

  return routines;
}

// --- UPDATE (Atualizar Rotina) ---
/**
 * Atualiza uma rotina existente no Firestore.
 * @param routineId O ID da rotina a ser atualizada.
 * @param dataToUpdate Os dados parciais da rotina a serem atualizados.
 */
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

// --- DELETE (Deletar Rotina) ---
/**
 * Deleta uma rotina do Firestore.
 * @param routineId O ID da rotina a ser deletada.
 */
export async function deleteRoutine(routineId: string): Promise<void> {
  const routineRef = doc(db, ROUTINES_COLLECTION, routineId);
  await deleteDoc(routineRef);

  // TODO: Considerar o que fazer com as tarefas associadas a esta rotina.
  // Opções:
  // 1. Deletar todas as tarefas associadas.
  // 2. Definir o `routineId` das tarefas associadas como `null`.
  // Isso exigiria uma consulta adicional para encontrar todas as tarefas com este `routineId`
  // e, em seguida, uma operação em lote (batch write) para atualizá-las ou deletá-las.
  // Exemplo (para definir routineId como null):
  /*
  import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
  const batch = writeBatch(db);
  const tasksToUpdateQuery = query(collection(db, "tasks"), where("routineId", "==", routineId));
  const tasksSnapshot = await getDocs(tasksToUpdateQuery);
  tasksSnapshot.forEach((taskDoc) => {
    batch.update(taskDoc.ref, { routineId: null, updatedAt: serverTimestamp() });
  });
  await batch.commit();
  */
}
