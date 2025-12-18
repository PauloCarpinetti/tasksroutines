import RoutineItem from "@/components/routines/RoutineItem";
import { useAuth } from "@/contexts/AuthContext";
import { Routine } from "@/model/Routine";
import { useState } from "react";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true); // 3. Estado para feedback de carregamento
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Obter o usuário do contexto de autenticação

  return (
    <RoutineItem
      routine={}
      onToggle={function (id: string): void {
        throw new Error("Function not implemented.");
      }}
      onEdit={function (task: Routine): void {
        throw new Error("Function not implemented.");
      }}
      onDelete={function (id: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
