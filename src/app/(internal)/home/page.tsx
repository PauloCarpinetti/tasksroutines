"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserContext";
import { ArrowRight, ListChecks, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { userProfile } = useUserProfile();

  React.useEffect(() => {
    console.log("Auth user object:", user);
  }, [user]);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-(--md-sys-color-on-surface)">
            Bem-vindo, {userProfile?.displayName || "Usuário"}!
          </h1>
          <p className="mt-2 text-lg text-(--md-sys-color-on-surface-variant)">
            O que você gostaria de gerenciar hoje?
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => router.push("/home/tasks")}
            className="p-6 bg-(--md-sys-color-surface-container-high) rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center"
          >
            <ListChecks className="w-12 h-12 text-(--md-sys-color-primary)" />
            <h2 className="mt-4 text-2xl font-semibold text-(--md-sys-color-on-surface)">
              Minhas Tarefas
            </h2>
            <p className="mt-2 text-(--md-sys-color-on-surface-variant)">
              Veja, crie e gerencie suas tarefas diárias.
            </p>
          </div>

          <div
            onClick={() => router.push("/home/routines")}
            className="p-6 bg-(--md-sys-color-surface-container-high) rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center"
          >
            <Repeat className="w-12 h-12 text-(--md-sys-color-tertiary)" />
            <h2 className="mt-4 text-2xl font-semibold text-(--md-sys-color-on-surface)">
              Minhas Rotinas
            </h2>
            <p className="mt-2 text-(--md-sys-color-on-surface-variant)">
              Organize suas tarefas em rotinas personalizadas.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
