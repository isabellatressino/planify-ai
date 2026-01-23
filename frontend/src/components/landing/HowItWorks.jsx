const steps = [
  {
    title: "Defina seu objetivo",
    description:
      "Informe o que você quer aprender, seu nível atual e quantas horas por dia pode dedicar aos estudos.",
  },
  {
    title: "Plano gerado por IA",
    description:
      "A IA monta um cronograma otimizado, recomenda materiais e define marcos claros para você evoluir com consistência.",
  },
  {
    title: "Acompanhe sua evolução",
    description:
      "Visualize seu progresso em tempo real, acompanhe métricas e receba sugestões inteligentes para ajustar sua rotina.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="flex flex-col justify-center">
      <div className="px-6 py-6 sm:px-8 md:px-10 max-w-7xl mx-auto space-y-4 mt-12">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-titles">Como funciona</h2>
        <p>Três passos simples para organizar seus estudos e manter o foco.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-text-body/30 bg-surface p-5"
            >
              <p className="text-xs font-semibold uppercase text-primary">
                Passo {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-text-titles font-display">
                {step.title}
              </h3>
              <p className="mt-2 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
