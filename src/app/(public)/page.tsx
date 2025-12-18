"use client";

import Button from "@/components/ui/Button";
import FeatureCard from "@/components/ui/FeatureCard";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface LandingPageProps {
  setPage: (page: string) => void;
}

export default function LandingPage({ setPage }: LandingPageProps) {
  const router = useRouter();
  const features = [
    {
      icon: CheckCircle,
      title: "Organização Simples",
      description:
        "Gerencie tarefas com facilidade. Crie, complete e delete com um clique.",
    },
    {
      icon: Zap,
      title: "Foco e Produtividade",
      description:
        "Mantenha o foco no que realmente importa com uma interface limpa e intuitiva.",
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description:
        "Seus dados são armazenados de forma segura e acessíveis de qualquer lugar.",
    },
  ];

  return (
    <div>
      <div className="py-12 sm:py-20 bg-(--md-sys-color-background)">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Organize sua Vida com o{" "}
            <span className="text-(--md-sys-color-primary)">TaskFlow</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A ferramenta mais simples e eficaz para gerenciar suas tarefas
            diárias, projetos e metas. Diga adeus ao caos e olá à produtividade.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => router.push("/login")}
              variant="primary"
              className="min-w-[200px]"
            >
              Comece Agora, É Grátis! <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push("/example")}
              variant="outline"
              className="min-w-[200px]"
            >
              Ver Demo
            </Button>
          </div>
          {/* Placeholder de Imagem */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="h-64 sm:h-96 bg-(--md-sys-color-surface-container) rounded-3xl shadow-2xl flex items-center justify-center border-4 border-(--md-sys-color-outline) overflow-hidden">
              <span className="text-gray-500 font-medium text-lg">
                [Image of a clean Task Management Dashboard]
              </span>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-(--md-sys-color-primary) text-center mb-10">
            Por que escolher o TaskFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
