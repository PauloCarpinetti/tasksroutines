"use client";

import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      <h1>Página Inicial</h1>
      <Button
        onClick={() => router.push("/home/tasks")}
        variant="primary"
        className="min-w-[200px]"
      >
        Ir para tarefas <ArrowRight className="w-5 h-5" />
      </Button>
      <Button
        onClick={() => router.push("/home/routines")}
        variant="outline"
        className="min-w-[200px]"
      >
        Ir para rotinas <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
