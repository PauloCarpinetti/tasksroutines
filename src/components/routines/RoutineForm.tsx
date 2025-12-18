"use client";

import { useState, useEffect } from "react";
import { Routine } from "@/model/Routine";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import Input from "../ui/Input";
import Card from "../ui/Card";

interface RoutineFormProps {
  onSave: (
    routineData: Omit<Routine, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<void>;
  onCancel: () => void;
  existingRoutine?: Routine | null;
}

export default function RoutineForm({
  onSave,
  onCancel,
  existingRoutine,
}: RoutineFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (existingRoutine) {
      setName(existingRoutine.name);
      setDescription(existingRoutine.description || "");
    }
  }, [existingRoutine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSave({ name, description });

    setName("");
    setDescription("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border rounded-lg bg-(--md-sys-color-surface-container) border-(--md-sys-color-outlineflex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Create User</h2>

          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Nome da Rotina"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=""
              required
              label={""}
              id={""}
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-(--md-sys-color-outline) rounded-xl focus:ring-(--md-sys-color-primary) focus:border-(--md-sys-color-primary) transition duration-150 shadow-sm bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) placeholder:text-(--md-sys-color-on-surface-variant)"
              rows={2}
            />
          </div>
          <div className="flex justify-between mt-6">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Rotina
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
