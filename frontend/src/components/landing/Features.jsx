import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
} from "lucide-react";

const features = [
  {
    title: "Planos gerados por IA em segundos",
    description: "Receba um roteiro claro e otimizado sem perder tempo.",
    icon: Sparkles,
  },
  {
    title: "Checklist diário por tarefas",
    description: "Transforme o plano em ações simples para todo dia.",
    icon: ListChecks,
  },
  {
    title: "Progresso do plano em %",
    description: "Acompanhe sua evolução e mantenha o ritmo.",
    icon: BarChart3,
  },
  {
    title: "Planos salvos no dashboard",
    description: "Acesse seus roteiros quando quiser, em um só lugar.",
    icon: LayoutDashboard,
  },
  {
    title: "Ajustes de nível, horas e prazo",
    description: "Personalize o cronograma para caber na sua rotina.",
    icon: SlidersHorizontal,
  },
  {
    title: "Interface limpa e responsiva",
    description: "Fácil de usar no desktop ou no celular.",
    icon: Smartphone,
  },
];

export default function Features() {
  return (
    <section id="features" className="flex flex-col justify-center">
      <div className="px-6 py-6 sm:px-8 md:px-10 max-w-7xl mx-auto space-y-6 mt-12">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-titles">
            Recursos
          </h2>
          <p className="max-w-2xl">
            Tudo o que você precisa para transformar um objetivo em um plano de
            estudo consistente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-text-body/30 bg-surface p-5 transition-all duration-500 ease-out hover:border-text-body/60 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-text-titles font-display">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
