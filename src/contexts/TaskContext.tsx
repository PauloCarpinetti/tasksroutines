"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Task } from "@/model/Task";
import {
  createTask,
  getTasksForUser,
  updateTask,
  deleteTask,
} from "@/lib/api/TaskService";
import { useRoutines } from "@/contexts/RoutineContext";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  allTasks: Task[];
  standaloneTasks: Task[]; // Tarefas que não pertencem a nenhuma rotina
  loading: boolean;
  error: string | null;
  addTask: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "routineId"> & {
      routineId?: string | null;
    }
  ) => Promise<string | undefined>;
  editTask: (
    taskId: string,
    dataToUpdate: Partial<Omit<Task, "id" | "createdAt">>
  ) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addTaskToRoutine } = useRoutines();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user?.uid) {
      setAllTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Busca TODAS as tarefas do usuário, sem filtros
      const userTasks = await getTasksForUser(user.uid);
      setAllTasks(userTasks);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (
    taskData: Parameters<TaskContextType["addTask"]>[0]
  ) => {
    if (!user?.uid) return;
    const newTask = { ...taskData, userId: user.uid };
    const newTaskId = await createTask(newTask);

    // Se a tarefa foi criada com um routineId, atualize a rotina.
    if (newTaskId && taskData.routineId) {
      await addTaskToRoutine(taskData.routineId, newTaskId);
    }
    await fetchTasks();
    return newTaskId;
  };

  const editTask = async (
    taskId: string,
    dataToUpdate: Parameters<TaskContextType["editTask"]>[1]
  ) => {
    await updateTask(taskId, dataToUpdate);
    await fetchTasks();
  };

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId);
    await fetchTasks();
  };

  // Memoiza a lista de tarefas avulsas para evitar recálculos desnecessários
  const standaloneTasks = useMemo(
    () => allTasks.filter((task) => !task.routineId),
    [allTasks]
  );

  const value = {
    allTasks,
    standaloneTasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    refreshTasks: fetchTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
