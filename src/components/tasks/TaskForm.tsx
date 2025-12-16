import React, { useState, useEffect } from "react";
import { List, Save, X } from "lucide-react";
import Button from "../ui/Button";
import { Task } from "@/model/Task";

interface TaskFormProps {
  onAddTask?: (title: string) => void;
  taskToEdit?: Task;
  onUpdateTask?: (task: Task) => void;
  onCancel?: () => void;
}

export default function TaskForm({
  onAddTask,
  taskToEdit,
  onUpdateTask,
  onCancel,
}: TaskFormProps) {
  const isEditing = !!taskToEdit;
  const [title, setTitle] = useState("");

  // useEffect para preencher o formulário quando entramos no modo de edição
  useEffect(() => {
    if (isEditing) {
      setTitle(taskToEdit.title);
    }
  }, [taskToEdit, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    if (isEditing && onUpdateTask) {
      onUpdateTask({ ...taskToEdit, title: trimmedTitle });
    } else if (onAddTask) {
      onAddTask(trimmedTitle);
    }
    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-(--md-sys-color-surface-container-low) rounded-xl shadow-xl border border-(--md-sys-color-outline-variant)"
    >
      <label
        htmlFor="task-input"
        className="block text-lg font-medium text-(--md-sys-color-on-surface-variant) mb-4"
      >
        {isEditing ? "Editar Tarefa" : "Adicionar Nova Tarefa"}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="task-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Agendar reunião com o cliente"
          required
          className="grow px-4 py-2 border border-(--md-sys-color-outline) rounded-xl focus:ring-(--md-sys-color-primary) focus:border-(--md-sys-color-primary) transition duration-150 shadow-sm bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface)"
        />
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-5 h-5" /> Cancelar
            </Button>
          )}
          <Button type="submit" disabled={title.trim().length === 0}>
            {isEditing ? (
              <>
                <Save className="w-5 h-5" /> Salvar
              </>
            ) : (
              <>
                <List className="w-5 h-5" /> Adicionar
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
