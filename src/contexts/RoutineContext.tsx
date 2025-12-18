"use client";

import {
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
import { useAuth } from "./AuthContext";

interface RoutineContextType {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  addRoutine: (
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<string | undefined>;
  editRoutine: (
    routineId: string,
    dataToUpdate: Partial<Omit<Routine, "id" | "createdAt">>
  ) => Promise<void>;
  removeRoutine: (routineId: string) => Promise<void>;
  refreshRoutines: () => Promise<void>;
}

export const RoutineContext = createContext<RoutineContextType | undefined>(
  undefined
);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
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
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    if (!user?.uid) return;
    try {
      const dataToSend = {
        ...routineData,
        userId: user.uid,
      };

      const newRoutineId = await createRoutine(dataToSend);

      const newRoutine: Routine = {
        name: dataToSend.name,
        description: dataToSend.description,
        userId: dataToSend.userId,
        id: newRoutineId,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };
      setRoutines((prev) => [...prev, newRoutine]);
      return newRoutineId;
    } catch (err) {
      console.error("Erro ao adicionar rotina:", err);
      setError("Não foi possível adicionar a rotina.");

      await fetchRoutines();
    }
  };

  const editRoutine = async (
    routineId: string,
    dataToUpdate: Partial<Omit<Routine, "id" | "createdAt">>
  ) => {
    await updateRoutine(routineId, dataToUpdate);
    // Atualiza o estado localmente
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, ...dataToUpdate } : r))
    );
  };

  const removeRoutine = async (routineId: string) => {
    await deleteRoutine(routineId);
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        loading,
        error,
        addRoutine,
        editRoutine,
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
