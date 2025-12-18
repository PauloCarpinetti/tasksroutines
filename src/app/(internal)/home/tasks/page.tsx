"use client";

import { useState, useEffect, useCallback } from "react";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import Button from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Task } from "@/model/Task";

// Tipos para o estado da view
type ViewState =
  | { view: "LIST" }
  | { view: "CREATE" }
  | { view: "EDIT"; task: Task };

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>({ view: "LIST" });
  const {
    standaloneTasks,
    loading,
    error,
    removeTask,
    toggleTask,
    refreshTasks,
  } = useTasks();

  const handleTaskSaved = async () => {
    await refreshTasks(); // Apenas recarrega a lista usando a função do contexto
    setViewState({ view: "LIST" });
  };

  // Funções handler atualizadas para usar o taskService

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
            onSave={handleTaskSaved}
            onCancel={() => setViewState({ view: "LIST" })}
          />
        );
      case "EDIT":
        // Passamos a tarefa a ser editada e a função de update para o TaskForm
        return (
          <TaskForm
            existingTask={viewState.task}
            onSave={handleTaskSaved}
            onCancel={() => setViewState({ view: "LIST" })}
          />
        );
      case "LIST":
      default:
        return (
          <TaskList
            tasks={standaloneTasks} // Usar as tarefas do contexto
            onEdit={(task) => setViewState({ view: "EDIT", task })} // Muda para a view de edição
            onDelete={removeTask} // Usar a função do contexto
            onToggle={toggleTask} // Usar a função do contexto
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
