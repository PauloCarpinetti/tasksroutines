import {
  createTask,
  getTasksForUser,
  updateTask,
  deleteTask,
} from "./TaskService";
import { Task } from "@/model/Task";

describe("Task Service", () => {
  const userId = "test-user-123";
  const scheduledDateTime = jest.useFakeTimers();

  it("deve criar uma nova tarefa e retorná-la para o usuário", async () => {
    // Dados da tarefa a ser criada
    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      userId: userId,
      title: "Minha Primeira Tarefa de Teste",
      description: "Descrição da tarefa.",
      scheduledDateTime: new Date().toISOString(),
      status: "PENDING",
      priority: "HIGH",
      routineId: "",
      completed: false,
    };

    // 1. Criar a tarefa
    const taskId = await createTask(taskData);
    expect(taskId).toBeDefined();
    expect(typeof taskId).toBe("string");

    // 2. Buscar as tarefas do usuário
    const tasks = await getTasksForUser(userId);

    // 3. Verificar se a tarefa foi criada corretamente
    expect(tasks).toHaveLength(1);
    const createdTask = tasks[0];
    expect(createdTask.id).toBe(taskId);
    expect(createdTask.title).toBe(taskData.title);
    expect(createdTask.userId).toBe(userId);
    expect(createdTask.status).toBe("PENDING");
  });

  it("deve atualizar uma tarefa existente", async () => {
    const initialTaskData = {
      userId: userId,
      title: "Tarefa para Atualizar",
      status: "PENDING" as const,
      priority: "LOW" as const,
      completed: false,
      scheduledDateTime: new Date().toISOString(),
    };

    const taskId = await createTask(initialTaskData);

    const updates = {
      title: "Tarefa Atualizada!",
      status: "COMPLETED" as const,
    };

    // Atualiza a tarefa
    await updateTask(taskId, updates);

    // Busca as tarefas para verificar a atualização
    const tasks = await getTasksForUser(userId);
    const updatedTask = tasks.find((t) => t.id === taskId);

    expect(updatedTask).toBeDefined();
    expect(updatedTask?.title).toBe(updates.title);
    expect(updatedTask?.status).toBe(updates.status);
    // O updatedAt deve ter sido modificado
    expect(updatedTask?.updatedAt).not.toBe(updatedTask?.createdAt);
  });

  it("deve deletar uma tarefa", async () => {
    const taskData = {
      userId: userId,
      title: "Tarefa para Deletar",
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      completed: false,
      scheduledDateTime: new Date().toISOString(),
    };

    const taskId = await createTask(taskData);

    // Verifica se a tarefa existe
    let tasks = await getTasksForUser(userId);
    expect(tasks).toHaveLength(1);

    // Deleta a tarefa
    await deleteTask(taskId);

    // Verifica se a tarefa foi removida
    tasks = await getTasksForUser(userId);
    expect(tasks).toHaveLength(0);
  });
});
