import { Timestamp } from "firebase/firestore";

export type TaskStatus = "PENDING" | "COMPLETED" | "OVERDUE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  userId: string;
  routineId?: string;
  title: string;
  description?: string;
  scheduledDateTime: Date | string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  completed: boolean;
}

export const exampleTask: Task = {
  id: "1",
  title: "Esta é uma tarefa de exemplo",
  completed: false,
  status: "PENDING",
  priority: "LOW",
  userId: "",

  scheduledDateTime: "",
  createdAt: "",
  updatedAt: "",
};

export const taskList: Task[] = [
  exampleTask,
  {
    id: "2",
    title: "Esta é uma tarefa de exemplo 2",
    completed: true,
    status: "PENDING",
    priority: "MEDIUM",
    userId: "",
    routineId: "1",
    scheduledDateTime: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    title: "Esta é uma tarefa de exemplo 3",
    completed: false,
    status: "PENDING",
    priority: "LOW",
    userId: "",
    routineId: "1",
    scheduledDateTime: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    title: "Esta é uma tarefa de exemplo 4",
    completed: false,
    status: "PENDING",
    priority: "HIGH",
    userId: "",
    routineId: "1",
    scheduledDateTime: "",
    createdAt: "",
    updatedAt: "",
  },
];
