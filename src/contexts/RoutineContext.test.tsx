import React from "react";
import { renderHook, act } from "@testing-library/react";
import { RoutineProvider, useRoutines } from "@/contexts/RoutineContext";
import * as routineService from "@/lib/api/RoutineService";

// --- Mock do AuthContext ---
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "test-user-123" },
  }),
}));

// --- Mock do routineService ---
jest.mock("@/lib/api/routineService", () => ({
  createRoutine: jest.fn(),
  getRoutinesForUser: jest.fn(),
  updateRoutine: jest.fn(),
  deleteRoutine: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RoutineProvider>{children}</RoutineProvider>
);

describe("RoutineContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("carregamento inicial", () => {
    it("deve carregar as rotinas do usuário ao montar o provider", async () => {
      (routineService.getRoutinesForUser as jest.Mock).mockResolvedValue([
        {
          id: "1",
          name: "Rotina Teste",
          userId: "test-user-123",
        },
      ]);

      const { result } = renderHook(() => useRoutines(), { wrapper });

      await act(async () => {});

      expect(routineService.getRoutinesForUser).toHaveBeenCalledWith(
        "test-user-123"
      );
      expect(result.current.routines).toHaveLength(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("addRoutine", () => {
    it("deve criar uma nova rotina e atualizar o estado local", async () => {
      (routineService.createRoutine as jest.Mock).mockResolvedValue(
        "routine-1"
      );
      (routineService.getRoutinesForUser as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useRoutines(), { wrapper });

      await act(async () => {
        await result.current.addRoutine({
          name: "Nova Rotina", // Apenas os dados que o formulário envia
        });
      });

      expect(routineService.createRoutine).toHaveBeenCalled();
      expect(result.current.routines).toHaveLength(1);
      expect(result.current.routines[0].name).toBe("Nova Rotina");
    });
  });

  describe("editRoutine", () => {
    it("deve atualizar uma rotina existente no estado local", async () => {
      (routineService.getRoutinesForUser as jest.Mock).mockResolvedValue([
        {
          id: "1",
          name: "Rotina Antiga",
          userId: "test-user-123",
        },
      ]);

      const { result } = renderHook(() => useRoutines(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.editRoutine("1", { name: "Rotina Atualizada" });
      });

      expect(routineService.updateRoutine).toHaveBeenCalledWith("1", {
        name: "Rotina Atualizada",
      });

      expect(result.current.routines[0].name).toBe("Rotina Atualizada");
    });
  });

  describe("removeRoutine", () => {
    it("deve remover uma rotina do estado local", async () => {
      (routineService.getRoutinesForUser as jest.Mock).mockResolvedValue([
        {
          id: "1",
          name: "Rotina para Remover",
          userId: "test-user-123",
        },
      ]);

      const { result } = renderHook(() => useRoutines(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.removeRoutine("1");
      });

      expect(routineService.deleteRoutine).toHaveBeenCalledWith("1");
      expect(result.current.routines).toHaveLength(0);
    });
  });

  describe("tratamento de erros", () => {
    it("deve definir error quando falhar ao carregar rotinas", async () => {
      (routineService.getRoutinesForUser as jest.Mock).mockRejectedValue(
        new Error("Firestore error")
      );

      const { result } = renderHook(() => useRoutines(), { wrapper });

      await act(async () => {});

      expect(result.current.error).toBe(
        "Não foi possível carregar as rotinas."
      );
      expect(result.current.loading).toBe(false);
    });
  });
});
