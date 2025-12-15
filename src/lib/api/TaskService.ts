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
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore"; // Importar serverTimestamp
import { Task } from "@/model/Task";

// Nome da coleção no Firestore
const TASKS_COLLECTION = "tasks";

// --- CREATE (Criar) ---
export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "routineId"> & {
    routineId?: string | null;
  }
): Promise<string> {
  const newTask = {
    ...taskData,
    routineId: taskData.routineId === undefined ? null : taskData.routineId, // Define como null se não for fornecido
    createdAt: serverTimestamp(), // Usar serverTimestamp para consistência
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);
  return docRef.id;
}

// --- READ (Ler todas as tarefas) ---
export async function getTasks(): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION));
  const querySnapshot = await getDocs(q);

  const tasks: Task[] = [];
  querySnapshot.forEach((doc) => {
    // Note: O Firestore armazena objetos simples. 'cast' para a interface Task
    tasks.push({
      id: doc.id,
      ...doc.data(),
    } as Task);
  });

  return tasks;
}

const toggleTask = async (id: string, currentStatus: boolean) => {
  const taskRef = doc(db, "tasks", id);
  await updateDoc(taskRef, { completed: !currentStatus });
};

// --- READ (Ler tarefas de um usuário específico) ---
/**
 * Obtém tarefas para um usuário específico, com opções de filtragem por rotina.
 * @param userId O ID do usuário.
 * @param options Opções de filtragem:
 *   - routineId?: string: Filtra tarefas que pertencem a uma rotina específica.
 *   - excludeRoutineTasks?: boolean: Se true, retorna apenas tarefas que NÃO pertencem a nenhuma rotina (routineId é null).
 * @returns Uma Promise que resolve para uma lista de tarefas.
 */
export async function getTasksForUser(
  userId: string,
  options?: { routineId?: string; excludeRoutineTasks?: boolean }
): Promise<Task[]> {
  // Cria uma referência para a coleção 'tasks'
  const tasksRef = collection(db, TASKS_COLLECTION);

  // Cria a consulta, filtrando pelo campo 'userId'
  let q = query(tasksRef, where("userId", "==", userId));

  if (options?.routineId) {
    q = query(q, where("routineId", "==", options.routineId));
  } else if (options?.excludeRoutineTasks) {
    q = query(q, where("routineId", "==", null)); // Busca tarefas onde routineId é explicitamente null
  }

  const querySnapshot = await getDocs(q);

  const tasks: Task[] = [];
  querySnapshot.forEach((doc) => {
    tasks.push({
      id: doc.id,
      ...doc.data(),
    } as Task);
  });

  return tasks;
}

// --- UPDATE (Atualizar) ---
export async function updateTask(
  taskId: string,
  dataToUpdate: Partial<Omit<Task, "id" | "createdAt">>
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, {
    ...dataToUpdate,
    updatedAt: serverTimestamp(), // Usar serverTimestamp para consistência
  });
}

// --- DELETE (Deletar) ---
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);

  // TODO: Considerar o que fazer com as rotinas que podem conter este taskId.
  // Se uma tarefa é deletada, seu ID deve ser removido da lista `taskIds` de qualquer rotina a que pertencia.
  // Isso exigiria uma consulta para encontrar rotinas que contêm este taskId e, em seguida,
  // uma atualização para remover o ID da tarefa do array `taskIds`.
  // Exemplo:
  /*
  import { arrayRemove } from "firebase/firestore";
  const routinesWithTaskQuery = query(collection(db, "routines"), where("taskIds", "array-contains", taskId));
  // ... buscar e atualizar as rotinas ...
  */
}
