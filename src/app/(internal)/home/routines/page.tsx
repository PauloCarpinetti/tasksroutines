"use client";

import { useState } from "react";
import { useRoutines } from "@/contexts/RoutineContext";
import { Routine } from "@/model/Routine";
import { PlusCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import RoutineList from "@/components/routines/RoutineList";
import RoutineForm from "@/components/routines/RoutineForm";

export default function RoutinesPage() {
  const { routines, loading: routinesLoading, addRoutine } = useRoutines();
  const [showRoutineForm, setShowRoutineForm] = useState(false);

  const handleSaveRoutine = async (
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    await addRoutine(routineData);
    setShowRoutineForm(false);
  };

  if (routinesLoading) {
    return <div className="text-center p-10">Carregando rotinas...</div>;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-on-surface">Minhas Rotinas</h1>
          {!showRoutineForm && (
            <Button onClick={() => setShowRoutineForm(true)}>
              <PlusCircle className="w-5 h-5" />
              <span>Nova Rotina</span>
            </Button>
          )}
        </div>
        {/* Formulário para Nova Rotina */}
        {showRoutineForm && (
          <RoutineForm
            onSave={handleSaveRoutine}
            onCancel={() => setShowRoutineForm(false)}
          />
        )}
        {/* Seção de Rotinas */}
        {routines.length > 0 ? (
          <RoutineList routines={routines} />
        ) : (
          !showRoutineForm && (
            <div className="text-center py-12">
              <p className="text-xl font-semibold">
                Nenhuma rotina encontrada.
              </p>
              <p className="text-(--md-sys-color-on-surface)">
                Crie sua primeira rotina para organizar suas tarefas.
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
