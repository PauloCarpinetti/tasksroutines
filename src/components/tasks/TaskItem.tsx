import { Task } from "@/model/Task";
import { CheckCircle, Trash2, Edit } from "lucide-react";
import Button from "../ui/Button";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const completedStyle = task.completed
    ? "line-through text-[var(--md-sys-color-on-surface-variant)] bg-[var(--md-sys-color-surface-container-lowest)]"
    : "text-[var(--md-sys-color-on-surface)] bg-[var(--md-sys-color-surface-container)] hover:bg-[var(--md-sys-color-surface-container-low)]";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl shadow-md transition duration-200 border border-(--md-sys-color-outline-variant) ${completedStyle}`}
    >
      {/* Status e Título */}
      {/* Adicionado w-full para ocupar a largura no modo coluna e sm:w-auto para resetar em telas maiores */}
      <div className="flex items-center gap-4 grow min-w-0 w-full sm:w-auto">
        <CheckCircle
          className={`w-6 h-6 cursor-pointer transition-colors ${
            task.completed
              ? "text-(--md-sys-color-sucess) hover:text-(--md-sys-color-success-container)"
              : "text-(--md-sys-color-error) hover:text-(--md-sys-color-error-container)"
          }`}
          onClick={() => onToggle(task.id)}
        />
        <span className="text-base truncate font-medium">{task.title}</span>
      </div>

      {/* Ações */}
      {/* Ajuste de margem e alinhamento */}
      <div className="flex gap-2 self-end sm:self-center mt-3 sm:mt-0 sm:ml-4 shrink-0">
        {/* Botão de Edição */}
        <Button
          onClick={() => onEdit(task)}
          aria-label={`Editar tarefa: ${task.title}`}
          className="p-2  rounded-full transition-colors"
        >
          <Edit className="w-5 h-5" />
        </Button>

        {/* Botão de Excluir */}
        <Button
          onClick={() => onDelete(task.id)}
          aria-label={`Excluir tarefa: ${task.title}`}
          variant="danger"
          className="p-2 rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
