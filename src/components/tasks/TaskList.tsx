import TaskItem from "./TaskItem";
import { Task } from "@/model/Task";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-(--md-sys-color-surface-container) rounded-xl shadow-lg border-dashed border-2 border-(--md-sys-color-outline-variant)">
        <p className="text-xl font-semibold text-(--md-sys-color-on-surface) mb-2">
          Sua lista está vazia!
        </p>
        <p className="text-(--md-sys-color-on-surface-variant)">
          Que tal adicionar uma nova tarefa para começar?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
