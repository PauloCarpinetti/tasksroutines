"use client";

import { useState } from "react";
import { Routine } from "@/model/Routine";
import { useTasks } from "@/contexts/TaskContext";
import { useRoutines } from "@/contexts/RoutineContext";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import { PlusCircle, Trash2 } from "lucide-react";

import { Task } from "@/model/Task";
import Button from "../ui/Button";

interface RoutineItemProps {
  routine: Routine;
}

export default function RoutineItem({ routine }: RoutineItemProps) {
  const {
    allTasks,
    loading: tasksLoading,
    toggleTask,
    removeTask,
    editTask,
  } = useTasks();
  const { removeRoutine } = useRoutines();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const routineTasks = allTasks.filter((task) => task.routineId === routine.id);

  const handleDeleteRoutine = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a rotina "${routine.name}"? As tarefas associadas não serão excluídas, mas ficarão sem rotina.`
      )
    ) {
      removeRoutine(routine.id);
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-sm bg-(--md-sys-color-surface-container) border-(--md-sys-color-outline)">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-(--md-sys-color-on-surface)">
            {routine.name}
          </h2>
          {routine.description && (
            <p className="text-(--md-sys-color-on-surface-variant) mt-1">
              {routine.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-1 text-sm text-(--md-sys-color-primary) hover:underline"
            aria-label={`Adicionar tarefa à rotina ${routine.name}`}
          >
            <PlusCircle size={16} />
            <span>Tarefa</span>
          </button>
          <Button
            onClick={handleDeleteRoutine}
            variant="danger"
            aria-label={`Excluir rotina ${routine.name}`}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          routineId={routine.id}
          onCancel={() => setShowTaskForm(false)}
          onSave={() => {
            setShowTaskForm(false); // Fecha o formulário após salvar
          }}
        />
      )}

      {taskToEdit && (
        // Formulário para EDITAR uma tarefa existente
        <TaskForm
          existingTask={taskToEdit}
          onCancel={() => setTaskToEdit(null)}
          onSave={() => setTaskToEdit(null)}
        />
      )}

      {tasksLoading ? (
        <p>Carregando tarefas...</p>
      ) : routineTasks.length > 0 ? (
        <div className="border-t border-(--md-sys-color-outline) mt-4 pt-4">
          <TaskList
            tasks={routineTasks}
            onEdit={(task) => setTaskToEdit(task)}
            onDelete={removeTask}
            onToggle={toggleTask}
          />
        </div>
      ) : (
        <p className="text-(--md-sys-color-primary) italic mt-4 pt-4 border-(--md-sys-color-outline)">
          Nenhuma tarefa nesta rotina.
        </p>
      )}
    </div>
  );
}
