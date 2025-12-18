import { renderHook, act } from "@testing-library/react";
import { TaskProvider, useTasks } from "@/contexts/TaskContext";
import * as taskService from "@/lib/api/TaskService";

// --- Mock do AuthContext ---
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "test-user-123" },
  }),
}));

// --- Mock do taskService ---
jest.mock("@/lib/api/taskService", () => ({
  createTask: jest.fn(),
  getTasksForUser: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
);

describe("TaskContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar tarefas do usuário", async () => {
    (
      taskService.getTasksForUser as jest.MockedFunction<
        typeof taskService.getTasksForUser
      >
    ).mockResolvedValue([
      {
        id: "1",
        title: "Teste",
        userId: "test-user-123",
        scheduledDateTime: "",
        status: "PENDING",
        priority: "LOW",
        createdAt: "",
        updatedAt: "",
        completed: false,
      },
    ]);

    const { result } = renderHook(() => useTasks(), { wrapper });

    // aguarda useEffect
    await act(async () => {});

    expect(result.current.allTasks).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });

  it("deve adicionar uma nova tarefa", async () => {
    (taskService.createTask as jest.Mock).mockResolvedValue("task-123");
    (taskService.getTasksForUser as jest.Mock).mockResolvedValue([]);

    const wrapper = ({ children }: any) => (
      <TaskProvider>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.addTask({
        title: "Nova tarefa",
        status: "PENDING",
        userId: "",
        scheduledDateTime: "",
        priority: "LOW",
        completed: false,
      });
    });

    expect(taskService.createTask).toHaveBeenCalled();
  });
});
