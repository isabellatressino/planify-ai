import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section id="cta" className="flex flex-col justify-center">
      <div className="px-6 py-6 sm:px-8 md:px-10 w-full mx-auto mt-12 text-center">
        <div className="w-full bg-primary/15 border-primary border rounded-lg px-8 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-titles">
              Pronto para estudar com mais clareza e consistência?
            </h2>
            <p className="mt-3">Crie seu primeiro roteiro em minutos e acompanhe sua evolução todos os dias.
            </p>
            <div className="mt-6 font-display font-semibold text-sm">
              <Link
                to="/register"
                aria-label="Ir para o cadastro e criar um roteiro"
                className="bg-primary border border-primary text-background py-2 px-6 rounded-md hover:bg-primary-hover transition-all active:scale-98 duration-500 ease-out cursor-pointer"
              >
                Criar meu roteiro grátis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
