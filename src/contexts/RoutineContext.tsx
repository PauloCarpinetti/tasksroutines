"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Routine } from "@/model/Routine";
import {
  createRoutine,
  getRoutinesForUser,
  updateRoutine,
  deleteRoutine,
} from "@/lib/api/RoutineService";
import { arrayUnion } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface RoutineContextType {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  addRoutine: (
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "taskIds"> & {
      taskIds?: string[];
    }
  ) => Promise<string | undefined>;
  editRoutine: (
    routineId: string,
    dataToUpdate: Partial<Omit<Routine, "id" | "createdAt">>
  ) => Promise<void>;
  addTaskToRoutine: (routineId: string, taskId: string) => Promise<void>;
  removeRoutine: (routineId: string) => Promise<void>;
  refreshRoutines: () => Promise<void>;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Obter o usuário autenticado
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    if (!user?.uid) {
      setRoutines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userRoutines = await getRoutinesForUser(user.uid);
      setRoutines(userRoutines);
    } catch (err) {
      console.error("Erro ao buscar rotinas:", err);
      setError("Não foi possível carregar as rotinas.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const addRoutine = async (
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "taskIds"> & {
      taskIds?: string[];
    }
  ) => {
    if (!user?.uid) return;
    try {
      const newRoutineId = await createRoutine({
        ...routineData,
        userId: user.uid,
        taskIds: routineData.taskIds || [], // Garante que taskIds seja um array
      });
      await fetchRoutines(); // Recarrega as rotinas para atualizar o estado
      return newRoutineId;
    } catch (err) {
      console.error("Erro ao adicionar rotina:", err);
      setError("Não foi possível adicionar a rotina.");
    }
  };

  const editRoutine = async (
    routineId: string,
    dataToUpdate: Partial<Omit<Routine, "id" | "createdAt">>
  ) => {
    await updateRoutine(routineId, dataToUpdate);
    await fetchRoutines();
  };

  const addTaskToRoutine = async (routineId: string, taskId: string) => {
    try {
      await updateRoutine(routineId, {
        taskIds: arrayUnion(taskId) as unknown as string[],
      });
      await fetchRoutines(); // Atualiza o estado das rotinas
    } catch (err) {
      console.error("Erro ao adicionar tarefa à rotina:", err);
    }
  };
  const removeRoutine = async (routineId: string) => {
    await deleteRoutine(routineId);
    await fetchRoutines();
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        loading,
        error,
        addRoutine,
        editRoutine,
        addTaskToRoutine,
        removeRoutine,
        refreshRoutines: fetchRoutines,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error("useRoutines must be used within a RoutineProvider");
  }
  return context;
}
