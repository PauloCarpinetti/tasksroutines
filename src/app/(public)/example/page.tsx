"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Routine } from "@/model/Routine";
import { Task } from "@/model/Task";
import RoutineItem from "@/components/routines/RoutineItem";
import { RoutineContext } from "@/contexts/RoutineContext";
import { TaskContext } from "@/contexts/TaskContext";
import Button from "@/components/ui/Button";

const demoRoutine: Routine = {
  id: "demo-routine-1",
  userId: "demo-user",
  name: "Rotina de Demonstração",
  description:
    "Esta é uma rotina de exemplo para mostrar como o sistema funciona. As ações como adicionar, editar e excluir estão desabilitadas nesta visualização.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const demoTasks: Task[] = [
  {
    id: "demo-task-1",
    userId: "demo-user",
    routineId: "demo-routine-1", // Pertence à rotina de demonstração
    title: "Analisar o layout da página de tarefas",
    completed: true,
    status: "COMPLETED",
    priority: "HIGH",
    scheduledDateTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-task-2",
    userId: "demo-user",
    routineId: "demo-routine-1",
    title: 'Implementar a funcionalidade de "arrastar e soltar"',
    completed: false,
    status: "PENDING",
    priority: "MEDIUM",
    scheduledDateTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-task-3",
    userId: "demo-user",
    routineId: "demo-routine-1",
    title: "Corrigir o bug de alinhamento no mobile",
    completed: false,
    status: "PENDING",
    priority: "LOW",
    scheduledDateTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function DemoProviders({ children }: { children: ReactNode }) {
  // Valor constante para o TaskContext
  const demoTaskContextValue = {
    allTasks: demoTasks,
    standaloneTasks: [],
    loading: false,
    error: null,
    // Funções de ação vazias, pois não são funcionais na demo.
    addTask: async () => undefined,
    editTask: async () => {},
    removeTask: async () => {},
    toggleTask: async () => {},
    refreshTasks: async () => {},
  };

  // Valor constante para o RoutineContext
  const demoRoutineContextValue = {
    routines: [demoRoutine],
    loading: false,
    error: null,
    addRoutine: async () => undefined,
    editRoutine: async () => {},
    removeRoutine: async () => {},
    refreshRoutines: async () => {},
  };

  return (
    <TaskContext.Provider value={demoTaskContextValue}>
      <RoutineContext.Provider value={demoRoutineContextValue}>
        {children}
      </RoutineContext.Provider>
    </TaskContext.Provider>
  );
}

export default function Example() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-on-surface">Demonstração</h1>
          <p className="text-lg text-on-surface-variant mt-2">
            Veja abaixo um exemplo de como suas rotinas e tarefas serão
            exibidas.
          </p>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/" passHref>
            <Button variant="outline">Voltar para o Início</Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="primary">Fazer Login</Button>
          </Link>
        </div>

        <DemoProviders>
          <RoutineItem routine={demoRoutine} />
        </DemoProviders>
      </div>
    </main>
  );
}
