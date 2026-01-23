import { Link } from "react-router-dom";
import ImgPreview from "../../assets/images/previewDashboard.png"
import ImgPreviewMobile from "../../assets/images/previewDashboard-mobile.png"

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center">
      <div className="px-6 py-6 sm:px-8 md:px-10 max-w-7xl mx-auto space-y-4 mt-30">
        <div className="mx-auto w-fit text-xs text-primary bg-primary/20 py-1 px-3 rounded-full border border-primary flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-primary">
          Novidade: IA GPT-4o mini integrada
        </div>

        <div className="text-center space-y-4 max-w-3xl">
          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-6xl text-text-titles font-display"
          >
            Crie um roteiro de estudo claro e acompanhe seu progresso
          </h1>

          <p className="sm:px-10">
            Receba um plano personalizado, um checklist diario de tarefas e um acompanhamento simples do seu avanco.
          </p>
        </div>

        <div className="flex flex-col text-center gap-4 sm:flex-row sm:justify-center font-display font-semibold">
          <div className="flex flex-col items-center gap-1">
            <Link
              to="/register"
              aria-label="Ir para cadastro"
              className="bg-primary border border-primary text-background py-2 px-6 rounded-md hover:bg-primary-hover transition-all active:scale-98 duration-500 ease-out cursor-pointer"
            >
              Criar meu primeiro roteiro gratis
            </Link>
          </div>

          <a
            href="#how"
            aria-label="Ir para a secao Como funciona"
            className="py-2 px-6 rounded-md border-2 border-text-body hover:border-text-titles hover:text-text-titles transition-all duration-500 ease-out active:scale-98 cursor-pointer"
          >
            Como funciona?
          </a>
        </div>
      </div>
      <div className="rounded-xl mx-auto overflow-hidden max-w-[90%] border-5 sm:border-10 mt-8 border-surface">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={ImgPreviewMobile}
          />

          <img
            src={ImgPreview}
            alt="Preview do dashboard do PlanifyAI"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </picture>
      </div>
    </section>
  );
}
