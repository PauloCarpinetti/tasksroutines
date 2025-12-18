import {
  createRoutine,
  getRoutinesForUser,
  updateRoutine,
  deleteRoutine,
  getRoutineById,
} from "./RoutineService";
import { Routine } from "@/model/Routine";

/**
 * Testes de integração do RoutineService
 *
 */
describe("Routine Service", () => {
  const userId = "test-user-123";

  it("deve criar uma nova rotina para o usuário", async () => {
    const routineData: Omit<Routine, "id" | "createdAt" | "updatedAt"> = {
      userId,
      name: "Rotina Matinal",
    };

    const routineId = await createRoutine(routineData);

    expect(routineId).toBeDefined();
    expect(typeof routineId).toBe("string");

    const routines = await getRoutinesForUser(userId);

    expect(routines).toHaveLength(1);
    expect(routines[0].id).toBe(routineId);
    expect(routines[0].name).toBe(routineData.name);
    expect(routines[0].userId).toBe(userId);
  });

  it("deve buscar rotinas apenas do usuário correto", async () => {
    await createRoutine({
      userId,
      name: "Rotina do Usuário A",
    });

    await createRoutine({
      userId: "another-user",
      name: "Rotina do Usuário B",
    });

    const routines = await getRoutinesForUser(userId);

    expect(routines).toHaveLength(0);
    expect(routines[0].userId).toBe(userId);
  });

  it("deve buscar uma rotina específica pelo ID", async () => {
    const routineId = await createRoutine({
      userId,
      name: "Rotina de Teste",
    });

    const routine = await getRoutineById(routineId);

    expect(routine).toBeDefined();
    expect(routine?.id).toBe(routineId);
    expect(routine?.name).toBe("Rotina de Teste");
  });

  it("deve retornar null ao buscar uma rotina inexistente", async () => {
    const routine = await getRoutineById("non-existing-id");

    expect(routine).toBeNull();
  });

  it("deve atualizar uma rotina existente", async () => {
    const routineId = await createRoutine({
      userId,
      name: "Rotina Antiga",
    });

    const updates = {
      name: "Rotina Atualizada",
      days: ["MONDAY", "TUESDAY"],
    };

    await updateRoutine(routineId, updates);

    const routines = await getRoutinesForUser(userId);
    const updatedRoutine = routines.find((r) => r.id === routineId);

    expect(updatedRoutine).toBeDefined();
    expect(updatedRoutine?.name).toBe(updates.name);
    expect(updatedRoutine?.updatedAt).toBeDefined();
  });

  it("deve deletar uma rotina", async () => {
    const routineId = await createRoutine({
      userId,
      name: "Rotina para Deletar",
    });

    let routines = await getRoutinesForUser(userId);
    expect(routines).toHaveLength(1);

    await deleteRoutine(routineId);

    routines = await getRoutinesForUser(userId);
    expect(routines).toHaveLength(0);
  });
});
