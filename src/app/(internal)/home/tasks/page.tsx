"use client";

import { useState, useEffect, useCallback } from "react";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import Button from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTask,
  deleteTask,
  getTasksForUser,
  updateTask,
} from "@/lib/api/TaskService";
import { Task } from "@/model/Task";

// Tipos para o estado da view
type ViewState =
  | { view: "LIST" }
  | { view: "CREATE" }
  | { view: "EDIT"; task: Task };

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>({ view: "LIST" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Função centralizada para buscar as tarefas
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const userTasks = await getTasksForUser(user.uid);
      setTasks(userTasks);
    } catch (err) {
      setError("Falha ao carregar as tarefas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // useEffect para buscar as tarefas quando o componente montar ou o usuário mudar
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Funções handler atualizadas para usar o taskService
  const handleAddTask = async (title: string) => {
    if (!user) return;
    const newTaskData = {
      userId: user.uid,
      title,
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      scheduledDateTime: new Date().toISOString(),
      completed: false,
    };
    await createTask(newTaskData);
    await fetchTasks();
    setViewState({ view: "LIST" });
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, {
      title: updatedTask.title,
      status: updatedTask.status,
      priority: updatedTask.priority,
    });
    await fetchTasks();
    setViewState({ view: "LIST" });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await fetchTasks();
  };

  const handleToggleTask = async (id: string) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    await updateTask(id, {
      completed: !taskToToggle.completed,
      status: !taskToToggle.completed ? "COMPLETED" : "PENDING",
    });
    await fetchTasks();
  };

  // Função para renderizar o conteúdo principal com base no estado
  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10">Carregando tarefas...</div>;
    }

    if (error) {
      return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    switch (viewState.view) {
      case "CREATE":
        return (
          <TaskForm
            onAddTask={handleAddTask}
            onCancel={() => setViewState({ view: "LIST" })}
          />
        );
      case "EDIT":
        // Passar tarefa a ser editada e a função de update para o TaskForm
        return (
          <TaskForm
            taskToEdit={viewState.task}
            onUpdateTask={handleUpdateTask}
            onCancel={() => setViewState({ view: "LIST" })}
          />
        );
      case "LIST":
      default:
        return (
          <TaskList
            tasks={tasks}
            onEdit={(task) => setViewState({ view: "EDIT", task })} // Muda para a view de edição
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        );
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-(--md-sys-color-primary)">
            Minhas Tarefas
          </h1>
          {/* O botão de "Adicionar" só aparece na tela de listagem */}
          {viewState.view === "LIST" && (
            <Button onClick={() => setViewState({ view: "CREATE" })}>
              <PlusCircle className="w-5 h-5" />
              <span>Nova Tarefa</span>
            </Button>
          )}
        </div>

        {/* Renderiza o conteúdo dinâmico */}
        {renderContent()}
      </div>
    </main>
  );
}
